import { isBlockType, type BlockType } from "@/lib/blocks";
import { mediaUrl, type MediaContext, type ProductLine, type Spec } from "@/lib/catalog";

/**
 * Lo que la landing necesita de un producto. NUNCA incluye costos ni datos de Dropi:
 * esta forma viaja al navegador.
 */
export type LandingMedia = {
  id: string;
  url: string;
  type: "imagen" | "video";
  context: MediaContext;
  alt: string;
  width: number | null;
  height: number | null;
};

export type LandingBlock = { id: string; type: BlockType; data: unknown };

export type LandingProduct = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  line: ProductLine;
  badges: string[];
  specs: Spec[];
  seoTitle: string | null;
  seoDescription: string | null;
  variantId: string | null;
  price: number;
  compareAtPrice: number | null;
  media: LandingMedia[];
  blocks: LandingBlock[];
};

export const LANDING_SELECT = `
  id, slug, title, subtitle, description, line, badges, specs, seo_title, seo_description,
  product_variants ( id, price, compare_at_price, position, is_active ),
  product_media ( id, storage_path, url, type, context, alt, width, height, position ),
  product_blocks ( id, type, data, position, is_visible )
` as const;

type Row = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  line: ProductLine;
  badges: string[];
  specs: unknown;
  seo_title: string | null;
  seo_description: string | null;
  product_variants: { id: string; price: number; compare_at_price: number | null; position: number; is_active: boolean }[];
  product_media: {
    id: string;
    storage_path: string | null;
    url: string | null;
    type: "imagen" | "video";
    context: MediaContext;
    alt: string;
    width: number | null;
    height: number | null;
    position: number;
  }[];
  product_blocks: { id: string; type: string; data: unknown; position: number; is_visible: boolean }[];
};

const byPosition = <T extends { position: number }>(a: T, b: T) => a.position - b.position;

export function toLandingProduct(row: Row, { includeHidden = false } = {}): LandingProduct {
  const variant = [...row.product_variants].filter((v) => v.is_active).sort(byPosition)[0];
  const specs = Array.isArray(row.specs)
    ? (row.specs as Spec[]).filter((s) => s && typeof s.label === "string")
    : [];

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    description: row.description,
    line: row.line,
    badges: row.badges,
    specs,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    variantId: variant?.id ?? null,
    price: variant?.price ?? 0,
    compareAtPrice: variant?.compare_at_price ?? null,
    media: [...row.product_media].sort(byPosition).map((m) => ({
      id: m.id,
      url: mediaUrl(m),
      type: m.type,
      context: m.context,
      alt: m.alt,
      width: m.width,
      height: m.height,
    })),
    blocks: [...row.product_blocks]
      .filter((b) => (includeHidden || b.is_visible) && isBlockType(b.type))
      .sort(byPosition)
      .map((b) => ({ id: b.id, type: b.type as BlockType, data: b.data })),
  };
}
