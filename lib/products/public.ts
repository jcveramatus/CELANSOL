import "server-only";
import { createClient } from "@supabase/supabase-js";
import { cacheLife, cacheTag } from "next/cache";
import type { Database } from "@/lib/supabase/database.types";
import { LANDING_SELECT, toLandingProduct } from "./landing";

/** Etiqueta de caché del catálogo. El panel la invalida con updateTag() al guardar. */
export const CATALOG_TAG = "catalogo";

/** Cliente anónimo sin cookies: solo ve lo público (RLS) y se puede cachear. */
function publicClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

export async function getPublicProduct(slug: string) {
  "use cache";
  cacheTag(CATALOG_TAG, `producto:${slug}`);
  cacheLife("days");

  const { data, error } = await publicClient()
    .from("products")
    .select(LANDING_SELECT)
    .eq("slug", slug)
    .eq("status", "activo")
    .maybeSingle();

  if (error) throw new Error(`No se pudo cargar el producto: ${error.message}`);
  return data ? toLandingProduct(data) : null;
}
