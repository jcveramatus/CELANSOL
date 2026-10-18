import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/page-header";
import { CATALOG_EDITORS, requireStaff } from "@/lib/auth";
import { DEFAULT_SETTINGS, type StoreSettings } from "@/lib/store/settings-schema";
import { createClient } from "@/lib/supabase/server";
import { PreferencesForm } from "./preferences-form";

export const metadata: Metadata = { title: "Preferencias" };

export default async function PreferencesPage() {
  await requireStaff(CATALOG_EDITORS);
  const supabase = await createClient();
  // Lectura directa (sin caché) para editar siempre lo último.
  const { data } = await supabase.from("store_settings").select("*").maybeSingle();

  const settings: StoreSettings = data
    ? {
        storeName: data.store_name,
        whatsappNumber: data.whatsapp_number,
        announcements: data.announcements,
        trustBadges: Array.isArray(data.trust_badges)
          ? (data.trust_badges as StoreSettings["trustBadges"])
          : DEFAULT_SETTINGS.trustBadges,
        footerText: data.footer_text,
        seoTitle: data.seo_title,
        seoDescription: data.seo_description,
        gtmContainerId: data.gtm_container_id,
      }
    : DEFAULT_SETTINGS;

  return (
    <>
      <PageHeader
        title="Preferencias"
        description="Datos generales que usa toda la tienda."
      />
      <main className="p-4 md:p-8">
        <PreferencesForm settings={settings} />
      </main>
    </>
  );
}
