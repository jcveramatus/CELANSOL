"use server";

import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { CATALOG_EDITORS, requireStaff } from "@/lib/auth";
import { BLOCK_META, isBlockType, parseBlock } from "@/lib/blocks";
import { CATALOG_TAG } from "@/lib/products/public";
import { createClient } from "@/lib/supabase/server";

export type BlockFormState = { ok?: boolean; message?: string };

function refresh(productId: string) {
  updateTag(CATALOG_TAG);
  revalidatePath(`/admin/productos/${productId}`);
}

export async function addBlock(productId: string, type: string) {
  await requireStaff(CATALOG_EDITORS);
  if (!z.uuid().safeParse(productId).success || !isBlockType(type)) throw new Error("Datos inválidos");

  const parsed = parseBlock(type, BLOCK_META[type].template);
  if (!parsed.ok) throw new Error(parsed.error);

  const supabase = await createClient();
  const { data: last } = await supabase
    .from("product_blocks")
    .select("position")
    .eq("product_id", productId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("product_blocks").insert({
    product_id: productId,
    type,
    data: parsed.data,
    position: (last?.position ?? -1) + 1,
  });
  if (error) throw new Error("No se pudo agregar el bloque");
  refresh(productId);
}

export async function saveBlock(
  blockId: string,
  _prev: BlockFormState,
  formData: FormData,
): Promise<BlockFormState> {
  await requireStaff(CATALOG_EDITORS);
  const supabase = await createClient();
  const { data: block } = await supabase
    .from("product_blocks")
    .select("product_id, type")
    .eq("id", blockId)
    .single();
  if (!block || !isBlockType(block.type)) return { ok: false, message: "Bloque no encontrado." };

  const parsed = parseBlock(block.type, {
    title: String(formData.get("title") ?? ""),
    body: String(formData.get("body") ?? ""),
    usLabel: String(formData.get("usLabel") ?? ""),
    themLabel: String(formData.get("themLabel") ?? ""),
    mediaId: (formData.get("mediaId") as string) || null,
  });
  if (!parsed.ok) return { ok: false, message: parsed.error };

  const { error } = await supabase
    .from("product_blocks")
    .update({ data: parsed.data })
    .eq("id", blockId);
  if (error) return { ok: false, message: "No se pudo guardar." };

  refresh(block.product_id);
  return { ok: true, message: "Guardado." };
}

export async function moveBlock(blockId: string, direction: "up" | "down") {
  await requireStaff(CATALOG_EDITORS);
  const supabase = await createClient();
  const { data: block } = await supabase
    .from("product_blocks")
    .select("product_id")
    .eq("id", blockId)
    .single();
  if (!block) return;

  const { data: siblings } = await supabase
    .from("product_blocks")
    .select("id")
    .eq("product_id", block.product_id)
    .order("position");
  if (!siblings) return;

  const ids = siblings.map((s) => s.id);
  const i = ids.indexOf(blockId);
  const j = direction === "up" ? i - 1 : i + 1;
  if (j < 0 || j >= ids.length) return;
  [ids[i], ids[j]] = [ids[j], ids[i]];

  await Promise.all(
    ids.map((id, position) => supabase.from("product_blocks").update({ position }).eq("id", id)),
  );
  refresh(block.product_id);
}

export async function toggleBlock(blockId: string, visible: boolean) {
  await requireStaff(CATALOG_EDITORS);
  const supabase = await createClient();
  const { data: block } = await supabase
    .from("product_blocks")
    .update({ is_visible: visible })
    .eq("id", blockId)
    .select("product_id")
    .single();
  if (block) refresh(block.product_id);
}

export async function deleteBlock(blockId: string) {
  await requireStaff(CATALOG_EDITORS);
  const supabase = await createClient();
  const { data: block } = await supabase
    .from("product_blocks")
    .delete()
    .eq("id", blockId)
    .select("product_id")
    .single();
  if (block) refresh(block.product_id);
}
