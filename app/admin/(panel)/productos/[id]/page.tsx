import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { CATALOG_EDITORS, requireStaff } from "@/lib/auth";
import { ButtonLink } from "@/components/ui/button";
import { isBlockType, toEditable } from "@/lib/blocks";
import { mediaUrl, one } from "@/lib/catalog";
import { createClient } from "@/lib/supabase/server";
import { BlocksEditor, type EditorBlock } from "../blocks-editor";
import { DeleteProductButton } from "../delete-product-button";
import { MediaManager } from "../media-manager";
import { ProductForm } from "../product-form";
import type { ProductFormValues } from "../product-form-values";

export const metadata: Metadata = { title: "Editar producto" };

export default async function EditProductPage({
  params,
  searchParams,
}: PageProps<"/admin/productos/[id]">) {
  await requireStaff(CATALOG_EDITORS);
  const { id } = await params;
  const { nuevo } = await searchParams;

  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const supabase = await createClient();
  const { data: p } = await supabase
    .from("products")
    .select(
      `*,
       product_variants ( id, price, compare_at_price, sku, stock, position, dropi_links ( * ) ),
       product_media ( id, storage_path, url, type, context, alt, position ),
       product_blocks ( id, type, data, position, is_visible )`,
    )
    .eq("id", id)
    .order("position", { referencedTable: "product_variants" })
    .order("position", { referencedTable: "product_media" })
    .order("position", { referencedTable: "product_blocks" })
    .maybeSingle();

  if (!p) notFound();

  const variant = p.product_variants[0];
  const dropi = one(variant?.dropi_links);

  const initial: ProductFormValues = {
    id: p.id,
    variantId: variant?.id,
    title: p.title,
    slug: p.slug,
    subtitle: p.subtitle,
    description: p.description,
    line: p.line,
    productType: p.product_type,
    status: p.status,
    testStatus: p.test_status,
    tags: p.tags,
    badges: p.badges,
    specs: p.specs,
    seoTitle: p.seo_title,
    seoDescription: p.seo_description,
    price: variant?.price ?? null,
    compareAtPrice: variant?.compare_at_price ?? null,
    sku: variant?.sku ?? null,
    stock: variant?.stock ?? null,
    costPrice: dropi?.cost_price ?? null,
    shippingEstimate: dropi?.shipping_estimate ?? null,
    dropiProductId: dropi?.dropi_product_id ?? null,
    dropiVariationId: dropi?.dropi_variation_id ?? null,
    supplierName: dropi?.supplier_name ?? null,
  };

  const media = p.product_media.map((m) => ({
    id: m.id,
    url: mediaUrl(m),
    type: m.type,
    context: m.context,
    alt: m.alt,
  }));

  const blocks: EditorBlock[] = p.product_blocks.flatMap((b) =>
    isBlockType(b.type)
      ? [{ id: b.id, type: b.type, isVisible: b.is_visible, values: toEditable(b.type, b.data) }]
      : [],
  );
  const images = media
    .filter((m) => m.type === "imagen")
    .map((m, i) => ({ id: m.id, label: `${m.context === "en_uso" ? "En uso" : "Foto"} ${i + 1}${m.alt ? ` · ${m.alt}` : ""}` }));

  return (
    <>
      <PageHeader
        title={p.title}
        description={`/productos/${p.slug}`}
        actions={
          <>
            <Link href="/admin/productos" className="self-center text-sm text-tinta-suave underline">
              Volver
            </Link>
            <ButtonLink href={`/admin/vista-previa/${p.id}`} target="_blank" variant="secondary" size="sm">
              Vista previa
            </ButtonLink>
            {p.status === "activo" && (
              <ButtonLink href={`/productos/${p.slug}`} target="_blank" variant="secondary" size="sm">
                Ver en tienda
              </ButtonLink>
            )}
            <DeleteProductButton productId={p.id} title={p.title} />
          </>
        }
      />
      <main className="flex flex-col gap-6 p-4 md:p-8">
        {nuevo && (
          <p role="status" className="rounded-xl bg-verde-suave px-4 py-3 text-sm text-verde-profundo">
            Producto creado. Ahora sube las fotos del producto y las fotos “en uso”.
          </p>
        )}
        <MediaManager productId={p.id} media={media} />
        <BlocksEditor productId={p.id} blocks={blocks} images={images} />
        <ProductForm initial={initial} />
      </main>
    </>
  );
}
