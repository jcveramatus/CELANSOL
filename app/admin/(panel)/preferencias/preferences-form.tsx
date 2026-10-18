"use client";

import { startTransition, useActionState } from "react";
import { PanelCard } from "@/components/admin/panel-card";
import { Button } from "@/components/ui/button";
import { Select, Textarea } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { STORE_ICONS, type StoreSettings } from "@/lib/store/settings-schema";
import { savePreferences, type PreferencesState } from "./actions";

const iconOptions = Object.entries(STORE_ICONS).map(([value, label]) => ({ value, label }));

export function PreferencesForm({ settings }: { settings: StoreSettings }) {
  const [state, action, pending] = useActionState<PreferencesState, FormData>(savePreferences, {});
  const errors = state.fieldErrors ?? {};
  const badges = [0, 1, 2, 3].map((i) => settings.trustBadges[i]);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(() => action(formData));
      }}
      className="flex flex-col gap-6 pb-24"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <PanelCard title="Datos de la tienda">
          <Input label="Nombre de la tienda" name="store_name" defaultValue={settings.storeName} error={errors.store_name} />
          <Input
            label="WhatsApp de ventas"
            name="whatsapp"
            inputMode="numeric"
            placeholder="987 654 321"
            defaultValue={settings.whatsappNumber?.replace(/^51/, "") ?? ""}
            hint="Celular de 9 dígitos. Lo usan el botón “Pedir ahora” y el ícono del encabezado."
            error={errors.whatsapp}
          />
          <Textarea
            label="Texto del pie de página"
            name="footer_text"
            defaultValue={settings.footerText}
            rows={3}
            error={errors.footer_text}
          />
        </PanelCard>

        <PanelCard title="Barra de anuncios" description="Mensajes que rotan arriba de toda la tienda.">
          <Textarea
            label="Un mensaje por línea (máximo 5)"
            name="announcements"
            defaultValue={settings.announcements.join("\n")}
            rows={5}
            hint="Cortos y concretos. Ej.: Pagas al recibir tu pedido"
          />
        </PanelCard>

        <PanelCard
          title="Sellos de confianza"
          description="Aparecen debajo del botón de compra en cada producto. Promete solo lo que cumples."
        >
          {badges.map((badge, i) => (
            <div key={i} className="grid gap-3 sm:grid-cols-[180px_1fr]">
              <Select
                label={`Ícono ${i + 1}`}
                name={`badge_icon_${i}`}
                defaultValue={badge?.icon ?? "star"}
                options={iconOptions}
              />
              <Input
                label={`Texto ${i + 1}`}
                name={`badge_text_${i}`}
                defaultValue={badge?.text ?? ""}
                maxLength={40}
                hint={i === 0 ? "Déjalo vacío para no mostrarlo" : undefined}
              />
            </div>
          ))}
        </PanelCard>

        <div className="flex flex-col gap-6">
          <PanelCard title="Inicio en Google" description="Título y descripción de la página de inicio.">
            <Input
              label="Título SEO"
              name="seo_title"
              defaultValue={settings.seoTitle ?? ""}
              maxLength={70}
              placeholder="Celansol | Soluciones inteligentes para tu hogar y tus mascotas"
              error={errors.seo_title}
            />
            <Textarea
              label="Descripción SEO"
              name="seo_description"
              defaultValue={settings.seoDescription ?? ""}
              rows={3}
              maxLength={160}
              error={errors.seo_description}
            />
          </PanelCard>

          <PanelCard
            title="Google Tag Manager"
            description="Ahí instalas el Pixel de Meta, GA4 y TikTok. La tienda envía los eventos (view_item, purchase) al dataLayer."
          >
            <Input
              label="ID del contenedor"
              name="gtm_container_id"
              placeholder="GTM-XXXXXXX"
              defaultValue={settings.gtmContainerId ?? ""}
              error={errors.gtm_container_id}
            />
          </PanelCard>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-borde bg-white/95 px-4 py-3 backdrop-blur md:left-60 md:px-8">
        <div className="flex items-center justify-end gap-4">
          {state.message && (
            <p role="status" className={state.ok ? "text-sm text-verde-profundo" : "text-sm text-peligro"}>
              {state.message}
            </p>
          )}
          <Button type="submit" disabled={pending}>
            {pending ? "Guardando…" : "Guardar preferencias"}
          </Button>
        </div>
      </div>
    </form>
  );
}
