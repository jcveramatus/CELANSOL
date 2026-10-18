"use client";

import { startTransition, useActionState, useState } from "react";
import { PanelCard } from "@/components/admin/panel-card";
import { Button } from "@/components/ui/button";
import { Select, Textarea } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  BADGE_OPTIONS,
  LINE_LABEL,
  STATUS_LABEL,
  TEST_LABEL,
  slugify,
  specsToText,
} from "@/lib/catalog";
import { saveProduct, type ProductFormState } from "./actions";
import type { ProductFormValues } from "./product-form-values";
import { MarginCalculator } from "./margin-calculator";

const toOptions = <T extends string>(labels: Record<T, string>) =>
  (Object.entries(labels) as [T, string][]).map(([value, label]) => ({ value, label }));

const num = (v: string) => (v.trim() === "" ? 0 : Number(v));

export function ProductForm({ initial }: { initial: ProductFormValues }) {
  const [state, action, pending] = useActionState<ProductFormState, FormData>(saveProduct, {});
  const errors = state.fieldErrors ?? {};

  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.id));
  const [price, setPrice] = useState(initial.price?.toString() ?? "");
  const [cost, setCost] = useState(initial.costPrice?.toString() ?? "");
  const [shipping, setShipping] = useState(initial.shippingEstimate?.toString() ?? "");

  return (
    <form
      // onSubmit (no action=) para que React no vacíe los campos si la validación falla.
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(() => action(formData));
      }}
      className="flex flex-col gap-6 pb-24"
    >
      {initial.id && <input type="hidden" name="id" value={initial.id} />}
      {initial.variantId && <input type="hidden" name="variant_id" value={initial.variantId} />}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex flex-col gap-6">
          <PanelCard title="Información">
            <Input
              label="Título"
              name="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
              placeholder="Fuente de agua automática para gatos 2.5 L"
              error={errors.title}
              required
            />
            <Input
              label="Enlace (slug)"
              name="slug"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              hint={`celansol.pe/productos/${slug || "…"}`}
              error={errors.slug}
              required
            />
            <Input
              label="Subtítulo"
              name="subtitle"
              defaultValue={initial.subtitle ?? ""}
              placeholder="Agua fresca y filtrada todo el día"
              hint="Beneficio principal en una línea"
            />
            <Textarea
              label="Descripción"
              name="description"
              defaultValue={initial.description ?? ""}
              rows={6}
              hint="Problema → solución → beneficios. Los bloques de la landing se editan aparte (próxima tarea)."
            />
          </PanelCard>

          <PanelCard title="Precio" description="Lo que paga el cliente.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Precio de venta (S/)"
                name="price"
                inputMode="decimal"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                error={errors.price}
                required
              />
              <Input
                label="Precio tachado (S/)"
                name="compare_at_price"
                inputMode="decimal"
                defaultValue={initial.compareAtPrice?.toString() ?? ""}
                hint="Opcional. Debe ser mayor al precio de venta"
                error={errors.compare_at_price}
              />
              <Input label="SKU" name="sku" defaultValue={initial.sku ?? ""} error={errors.sku} />
              <Input
                label="Stock propio"
                name="stock"
                inputMode="numeric"
                defaultValue={initial.stock?.toString() ?? ""}
                hint="Déjalo vacío si el stock lo maneja Dropi"
                error={errors.stock}
              />
            </div>
          </PanelCard>

          <PanelCard
            title="Proveedor y costos (Dropi)"
            description="Privado: solo lo ve tu equipo."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Costo del proveedor (S/)"
                name="cost_price"
                inputMode="decimal"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                error={errors.cost_price}
                required
              />
              <Input
                label="Flete estimado (S/)"
                name="shipping_estimate"
                inputMode="decimal"
                value={shipping}
                onChange={(e) => setShipping(e.target.value)}
                error={errors.shipping_estimate}
                required
              />
              <Input
                label="Proveedor"
                name="supplier_name"
                defaultValue={initial.supplierName ?? ""}
              />
              <Input
                label="ID de producto en Dropi"
                name="dropi_product_id"
                defaultValue={initial.dropiProductId ?? ""}
              />
              <Input
                label="ID de variación en Dropi"
                name="dropi_variation_id"
                defaultValue={initial.dropiVariationId ?? ""}
                hint="Solo si el producto tiene variaciones en Dropi"
              />
            </div>
          </PanelCard>

          <PanelCard title="Especificaciones" description="Se muestran como ficha técnica con íconos.">
            <Textarea
              label="Una por línea, con el formato Etiqueta: valor"
              name="specs"
              defaultValue={specsToText(initial.specs)}
              placeholder={"Capacidad: 2.5 L\nFiltro: carbón activado\nConsumo: 2 W"}
              rows={5}
            />
          </PanelCard>

          <PanelCard title="SEO" description="Cómo aparece en Google.">
            <Input
              label="Título SEO"
              name="seo_title"
              defaultValue={initial.seoTitle ?? ""}
              hint="Si lo dejas vacío se usa el título del producto"
            />
            <Textarea
              label="Descripción SEO"
              name="seo_description"
              defaultValue={initial.seoDescription ?? ""}
              rows={3}
              maxLength={160}
              hint="Máximo 160 caracteres"
            />
          </PanelCard>
        </div>

        <div className="flex flex-col gap-6">
          <PanelCard title="Estado">
            <Select
              label="Publicación"
              name="status"
              defaultValue={initial.status}
              options={toOptions(STATUS_LABEL)}
              hint="Solo los activos se ven en la tienda"
            />
            <Select
              label="Testeo"
              name="test_status"
              defaultValue={initial.testStatus}
              options={toOptions(TEST_LABEL)}
            />
          </PanelCard>

          <PanelCard title="Organización">
            <Select
              label="Línea"
              name="line"
              defaultValue={initial.line}
              options={toOptions(LINE_LABEL)}
            />
            <Input
              label="Tipo de producto"
              name="product_type"
              defaultValue={initial.productType ?? ""}
              placeholder="Bebederos"
            />
            <Input
              label="Etiquetas"
              name="tags"
              defaultValue={initial.tags.join(", ")}
              placeholder="gatos, agua, automatico"
              hint="Separadas por comas"
            />
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-1 text-sm font-semibold">Badges</legend>
              {BADGE_OPTIONS.map((badge) => (
                <label key={badge} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="badges"
                    value={badge}
                    defaultChecked={initial.badges.includes(badge)}
                    className="size-4 accent-verde-accion"
                  />
                  {badge}
                </label>
              ))}
            </fieldset>
          </PanelCard>

          <PanelCard title="Calculadora de margen" description="Cuánto puedes pagar en ads por pedido.">
            <MarginCalculator price={num(price)} cost={num(cost)} shipping={num(shipping)} />
          </PanelCard>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-borde bg-white/95 px-4 py-3 backdrop-blur md:left-60 md:px-8">
        <div className="flex items-center justify-end gap-4">
          {state.message && (
            <p
              role="status"
              className={state.ok ? "text-sm text-verde-profundo" : "text-sm text-peligro"}
            >
              {state.message}
            </p>
          )}
          <Button type="submit" disabled={pending}>
            {pending ? "Guardando…" : initial.id ? "Guardar cambios" : "Crear producto"}
          </Button>
        </div>
      </div>
    </form>
  );
}
