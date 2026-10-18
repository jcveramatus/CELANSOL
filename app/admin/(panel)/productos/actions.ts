"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { CATALOG_EDITORS, requireStaff } from "@/lib/auth";
import { parseSpecs } from "@/lib/catalog";
import { CATALOG_TAG } from "@/lib/products/public";
import { createClient } from "@/lib/supabase/server";

export type ProductFormState = {
  ok?: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
};

const emptyToUndefined = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;

const optionalText = z.preprocess(emptyToUndefined, z.string().trim().optional());
const money = (label: string) =>
  z.coerce
    .number({ error: `${label}: escribe un número` })
    .min(0, `${label} no puede ser negativo`)
    .max(99999, `${label} es demasiado alto`);
const optionalMoney = (label: string) => z.preprocess(emptyToUndefined, money(label).optional());

const productSchema = z
  .object({
    title: z.string().trim().min(3, "El título debe tener al menos 3 caracteres"),
    slug: z
      .string()
      .trim()
      .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Solo minúsculas, números y guiones (ej. fuente-para-gatos)"),
    subtitle: optionalText,
    description: optionalText,
    line: z.enum(["hogar", "mascotas"]),
    product_type: optionalText,
    status: z.enum(["borrador", "activo", "archivado"]),
    test_status: z.enum(["sin_testear", "en_test", "ganador", "pausado", "descartado"]),
    tags: z.string().optional(),
    badges: z.array(z.string()).default([]),
    specs: z.string().optional(),
    seo_title: optionalText,
    seo_description: optionalText,

    price: money("Precio").refine((n) => n > 0, "El precio debe ser mayor a 0"),
    compare_at_price: optionalMoney("Precio tachado"),
    sku: optionalText,
    stock: z.preprocess(emptyToUndefined, z.coerce.number().int().min(0).optional()),

    cost_price: money("Costo del proveedor"),
    shipping_estimate: money("Flete"),
    dropi_product_id: optionalText,
    dropi_variation_id: optionalText,
    supplier_name: optionalText,
  })
  .refine((d) => d.compare_at_price === undefined || d.compare_at_price > d.price, {
    path: ["compare_at_price"],
    message: "El precio tachado debe ser mayor al precio de venta",
  });

function readForm(formData: FormData) {
  const entries = Object.fromEntries(
    [...formData.keys()].filter((k) => k !== "badges").map((k) => [k, formData.get(k)]),
  );
  return { ...entries, badges: formData.getAll("badges").map(String) };
}

export async function saveProduct(
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireStaff(CATALOG_EDITORS);

  const productId = (formData.get("id") as string) || null;
  const variantId = (formData.get("variant_id") as string) || null;

  const parsed = productSchema.safeParse(readForm(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return { ok: false, message: "Revisa los campos marcados.", fieldErrors };
  }
  const d = parsed.data;
  const supabase = await createClient();

  const productRow = {
    title: d.title,
    slug: d.slug,
    subtitle: d.subtitle ?? null,
    description: d.description ?? null,
    line: d.line,
    product_type: d.product_type ?? null,
    status: d.status,
    test_status: d.test_status,
    tags: (d.tags ?? "")
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean),
    badges: d.badges,
    specs: parseSpecs(d.specs ?? ""),
    seo_title: d.seo_title ?? null,
    seo_description: d.seo_description ?? null,
  };

  let id = productId;
  if (id) {
    const { data: current } = await supabase
      .from("products")
      .select("published_at")
      .eq("id", id)
      .single();
    const { error } = await supabase
      .from("products")
      .update({
        ...productRow,
        published_at:
          d.status === "activo" && !current?.published_at ? new Date().toISOString() : undefined,
      })
      .eq("id", id);
    if (error) return dbError(error);
  } else {
    const { data, error } = await supabase
      .from("products")
      .insert({
        ...productRow,
        published_at: d.status === "activo" ? new Date().toISOString() : null,
      })
      .select("id")
      .single();
    if (error) return dbError(error);
    id = data.id;
  }

  const variantRow = {
    product_id: id,
    price: d.price,
    compare_at_price: d.compare_at_price ?? null,
    sku: d.sku ?? null,
    stock: d.stock ?? null,
  };
  let vId = variantId;
  if (vId) {
    const { error } = await supabase.from("product_variants").update(variantRow).eq("id", vId);
    if (error) return dbError(error);
  } else {
    const { data, error } = await supabase
      .from("product_variants")
      .insert(variantRow)
      .select("id")
      .single();
    if (error) return dbError(error);
    vId = data.id;
  }

  const { error: dropiError } = await supabase.from("dropi_links").upsert(
    {
      variant_id: vId,
      cost_price: d.cost_price,
      shipping_estimate: d.shipping_estimate,
      dropi_product_id: d.dropi_product_id ?? null,
      dropi_variation_id: d.dropi_variation_id ?? null,
      supplier_name: d.supplier_name ?? null,
    },
    { onConflict: "variant_id" },
  );
  if (dropiError) return dbError(dropiError);

  revalidatePath("/admin/productos");
  updateTag(CATALOG_TAG);
  revalidatePath("/admin");

  if (!productId) redirect(`/admin/productos/${id}?nuevo=1`);
  revalidatePath(`/admin/productos/${id}`);
  return { ok: true, message: "Cambios guardados." };
}

function dbError(error: { code?: string; message: string }): ProductFormState {
  if (error.code === "23505" && error.message.includes("slug")) {
    return {
      ok: false,
      message: "Ya existe un producto con ese enlace.",
      fieldErrors: { slug: "Este enlace ya está en uso" },
    };
  }
  if (error.code === "23505" && error.message.includes("sku")) {
    return { ok: false, message: "Ese SKU ya existe.", fieldErrors: { sku: "SKU repetido" } };
  }
  console.error("[saveProduct]", error);
  return { ok: false, message: "No se pudo guardar. Intenta de nuevo." };
}

export async function deleteProduct(productId: string) {
  await requireStaff(CATALOG_EDITORS);
  const supabase = await createClient();

  const { data: files } = await supabase.storage.from("productos").list(productId);
  if (files?.length) {
    await supabase.storage.from("productos").remove(files.map((f) => `${productId}/${f.name}`));
  }
  const { error } = await supabase.from("products").delete().eq("id", productId);
  if (error) throw new Error("No se pudo eliminar el producto");

  revalidatePath("/admin/productos");
  updateTag(CATALOG_TAG);
  revalidatePath("/admin");
  redirect("/admin/productos");
}

// ---------------------------------------------------------------------------
// Fotos y videos. El archivo lo sube el navegador directo a Storage (RLS),
// aquí solo se registra y ordena.
// ---------------------------------------------------------------------------

const mediaSchema = z.object({
  productId: z.uuid(),
  storagePath: z.string().min(1),
  type: z.enum(["imagen", "video"]),
  context: z.enum(["producto", "en_uso"]),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});

export async function addMedia(input: z.input<typeof mediaSchema>) {
  await requireStaff(CATALOG_EDITORS);
  const m = mediaSchema.parse(input);
  if (!m.storagePath.startsWith(`${m.productId}/`)) throw new Error("Ruta inválida");

  const supabase = await createClient();
  const { data: last } = await supabase
    .from("product_media")
    .select("position")
    .eq("product_id", m.productId)
    .eq("context", m.context)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("product_media").insert({
    product_id: m.productId,
    storage_path: m.storagePath,
    type: m.type,
    context: m.context,
    width: m.width ?? null,
    height: m.height ?? null,
    position: (last?.position ?? -1) + 1,
  });
  if (error) throw new Error("No se pudo registrar el archivo");
  revalidatePath(`/admin/productos/${m.productId}`);
  revalidatePath("/admin/productos");
  updateTag(CATALOG_TAG);
}

export async function deleteMedia(mediaId: string) {
  await requireStaff(CATALOG_EDITORS);
  const supabase = await createClient();
  const { data: media } = await supabase
    .from("product_media")
    .select("product_id, storage_path")
    .eq("id", mediaId)
    .single();
  if (!media) return;

  if (media.storage_path) {
    await supabase.storage.from("productos").remove([media.storage_path]);
  }
  await supabase.from("product_media").delete().eq("id", mediaId);
  revalidatePath(`/admin/productos/${media.product_id}`);
  revalidatePath("/admin/productos");
  updateTag(CATALOG_TAG);
}

export async function moveMedia(mediaId: string, direction: "up" | "down") {
  await requireStaff(CATALOG_EDITORS);
  const supabase = await createClient();
  const { data: media } = await supabase
    .from("product_media")
    .select("id, product_id, context, position")
    .eq("id", mediaId)
    .single();
  if (!media) return;

  const { data: siblings } = await supabase
    .from("product_media")
    .select("id, position")
    .eq("product_id", media.product_id)
    .eq("context", media.context)
    .order("position");
  if (!siblings) return;

  const index = siblings.findIndex((s) => s.id === mediaId);
  const swapWith = siblings[direction === "up" ? index - 1 : index + 1];
  if (!swapWith) return;

  // Reindexa para evitar posiciones duplicadas.
  const ordered = [...siblings];
  ordered[index] = swapWith;
  ordered[siblings.indexOf(swapWith)] = siblings[index];
  await Promise.all(
    ordered.map((s, position) => supabase.from("product_media").update({ position }).eq("id", s.id)),
  );
  revalidatePath(`/admin/productos/${media.product_id}`);
  revalidatePath("/admin/productos");
  updateTag(CATALOG_TAG);
}

export async function setMediaContext(mediaId: string, context: "producto" | "en_uso") {
  await requireStaff(CATALOG_EDITORS);
  const supabase = await createClient();
  const { data: media } = await supabase
    .from("product_media")
    .select("product_id")
    .eq("id", mediaId)
    .single();
  if (!media) return;

  const { data: last } = await supabase
    .from("product_media")
    .select("position")
    .eq("product_id", media.product_id)
    .eq("context", context)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  await supabase
    .from("product_media")
    .update({ context, position: (last?.position ?? -1) + 1 })
    .eq("id", mediaId);
  revalidatePath(`/admin/productos/${media.product_id}`);
  updateTag(CATALOG_TAG);
}

export async function updateMediaAlt(mediaId: string, alt: string) {
  await requireStaff(CATALOG_EDITORS);
  const supabase = await createClient();
  await supabase
    .from("product_media")
    .update({ alt: alt.trim().slice(0, 200) })
    .eq("id", mediaId);
  updateTag(CATALOG_TAG);
}
