import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import { LANDING_SELECT, toLandingProduct } from "./landing";

/** Etiqueta de caché del catálogo. El panel la invalida con updateTag() al guardar. */
export const CATALOG_TAG = "catalogo";

export async function getPublicProduct(slug: string) {
  "use cache";
  cacheTag(CATALOG_TAG, `producto:${slug}`);
  cacheLife("days");

  const { data, error } = await createPublicClient()
    .from("products")
    .select(LANDING_SELECT)
    .eq("slug", slug)
    .eq("status", "activo")
    .maybeSingle();

  if (error) throw new Error(`No se pudo cargar el producto: ${error.message}`);
  return data ? toLandingProduct(data) : null;
}
