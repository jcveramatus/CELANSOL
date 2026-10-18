"use server";

import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { CATALOG_EDITORS, requireStaff } from "@/lib/auth";
import { STORE_TAG } from "@/lib/store/settings";
import { storeIcon } from "@/lib/store/settings-schema";
import { createClient } from "@/lib/supabase/server";

export type PreferencesState = { ok?: boolean; message?: string; fieldErrors?: Record<string, string> };

const optional = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
  z.string().trim().optional(),
);

const schema = z.object({
  store_name: z.string().trim().min(2, "Escribe el nombre de la tienda").max(60),
  whatsapp: z.preprocess(
    (v) => (typeof v === "string" ? v.replace(/\D/g, "").replace(/^51(?=9\d{8}$)/, "") : v),
    z.union([z.literal(""), z.string().regex(/^9\d{8}$/, "Celular peruano de 9 dígitos que empieza con 9")]),
  ),
  announcements: z.string().optional(),
  footer_text: z.string().trim().min(1, "Escribe un texto corto").max(240),
  seo_title: optional.pipe(z.string().max(70, "Máximo 70 caracteres").optional()),
  seo_description: optional.pipe(z.string().max(160, "Máximo 160 caracteres").optional()),
  gtm_container_id: optional.pipe(
    z
      .string()
      .toUpperCase()
      .regex(/^GTM-[A-Z0-9]{4,12}$/, "Formato GTM-XXXXXXX (lo ves en tagmanager.google.com)")
      .optional(),
  ),
});

export async function savePreferences(
  _prev: PreferencesState,
  formData: FormData,
): Promise<PreferencesState> {
  const staff = await requireStaff(CATALOG_EDITORS);

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
    return { ok: false, message: "Revisa los campos marcados.", fieldErrors };
  }
  const d = parsed.data;

  const announcements = (d.announcements ?? "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 5);

  const badges = [0, 1, 2, 3]
    .map((i) => ({
      icon: storeIcon.safeParse(formData.get(`badge_icon_${i}`)).data,
      text: String(formData.get(`badge_text_${i}`) ?? "").trim().slice(0, 40),
    }))
    .filter((b): b is { icon: NonNullable<typeof b.icon>; text: string } => Boolean(b.icon && b.text));

  const supabase = await createClient();
  const { error } = await supabase
    .from("store_settings")
    .update({
      store_name: d.store_name,
      whatsapp_number: d.whatsapp ? `51${d.whatsapp}` : null,
      announcements,
      trust_badges: badges,
      footer_text: d.footer_text,
      seo_title: d.seo_title ?? null,
      seo_description: d.seo_description ?? null,
      gtm_container_id: d.gtm_container_id ?? null,
      updated_by: staff.userId,
    })
    .eq("id", true);

  if (error) {
    console.error("[savePreferences]", error);
    return { ok: false, message: "No se pudo guardar. Intenta de nuevo." };
  }

  updateTag(STORE_TAG);
  revalidatePath("/admin/preferencias");
  return { ok: true, message: "Preferencias guardadas." };
}
