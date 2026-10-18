import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";
import { createPublicClient } from "@/lib/supabase/public";
import { DEFAULT_SETTINGS, trustBadgeSchema, type StoreSettings } from "./settings-schema";

/** Etiqueta de caché de la tienda (preferencias y páginas). Se invalida con updateTag(). */
export const STORE_TAG = "tienda";

export async function getStoreSettings(): Promise<StoreSettings> {
  "use cache";
  cacheTag(STORE_TAG);
  cacheLife("days");

  const { data } = await createPublicClient().from("store_settings").select("*").maybeSingle();
  if (!data) return DEFAULT_SETTINGS;

  const badges = z.array(trustBadgeSchema).safeParse(data.trust_badges);
  return {
    storeName: data.store_name,
    whatsappNumber: data.whatsapp_number,
    announcements: data.announcements.filter(Boolean),
    trustBadges: badges.success ? badges.data : DEFAULT_SETTINGS.trustBadges,
    footerText: data.footer_text,
    seoTitle: data.seo_title,
    seoDescription: data.seo_description,
    gtmContainerId: data.gtm_container_id,
  };
}
