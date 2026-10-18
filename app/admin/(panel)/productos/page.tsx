import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { requireStaff } from "@/lib/auth";
import {
  LINE_LABEL,
  STATUS_LABEL,
  TEST_LABEL,
  mediaUrl,
  one,
  type ProductLine,
  type ProductStatus,
  type TestStatus,
} from "@/lib/catalog";
import { computeEconomics } from "@/lib/economics";
import { createClient } from "@/lib/supabase/server";
import { cn, formatSoles } from "@/lib/utils";

export const metadata: Metadata = { title: "Productos" };

const statusBadge: Record<ProductStatus, "nuevo" | "neutral" | "escasez"> = {
  activo: "nuevo",
  borrador: "neutral",
  archivado: "escasez",
};
const testBadge: Record<TestStatus, "neutral" | "oferta" | "top" | "escasez"> = {
  sin_testear: "neutral",
  en_test: "oferta",
  ganador: "top",
  pausado: "neutral",
  descartado: "escasez",
};

const healthText = { bueno: "text-verde-profundo", justo: "text-amber-700", malo: "text-peligro" };

function pick<T extends string>(value: string | string[] | undefined, allowed: Record<T, string>) {
  return typeof value === "string" && value in allowed ? (value as T) : undefined;
}

export default async function ProductsPage({ searchParams }: PageProps<"/admin/productos">) {
  await requireStaff();
  const params = await searchParams;
  const estado = pick<ProductStatus>(params.estado, STATUS_LABEL);
  const linea = pick<ProductLine>(params.linea, LINE_LABEL);
  const test = pick<TestStatus>(params.test, TEST_LABEL);

  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select(
      `id, slug, title, line, status, test_status,
       product_variants ( price, compare_at_price, position, dropi_links ( cost_price, shipping_estimate ) ),
       product_media ( storage_path, url, type, context, position )`,
    )
    .eq("product_media.context", "producto")
    .order("created_at", { ascending: false })
    .order("position", { referencedTable: "product_media" })
    .order("position", { referencedTable: "product_variants" });
  if (estado) query = query.eq("status", estado);
  if (linea) query = query.eq("line", linea);
  if (test) query = query.eq("test_status", test);

  const { data: products, error } = await query;

  const filterHref = (key: string, value?: string) => {
    const next = new URLSearchParams();
    for (const [k, v] of Object.entries({ estado, linea, test, [key]: value })) {
      if (v) next.set(k, v);
    }
    const qs = next.toString();
    return qs ? `/admin/productos?${qs}` : "/admin/productos";
  };

  return (
    <>
      <PageHeader
        title="Productos"
        description="Catálogo, precios, costos y estado de testeo."
        actions={<ButtonLink href="/admin/productos/nuevo">Nuevo producto</ButtonLink>}
      />
      <main className="flex flex-col gap-4 p-4 md:p-8">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <FilterGroup
            label="Estado"
            current={estado}
            options={STATUS_LABEL}
            href={(v) => filterHref("estado", v)}
          />
          <FilterGroup
            label="Línea"
            current={linea}
            options={LINE_LABEL}
            href={(v) => filterHref("linea", v)}
          />
          <FilterGroup
            label="Testeo"
            current={test}
            options={TEST_LABEL}
            href={(v) => filterHref("test", v)}
          />
        </div>

        {error && (
          <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-peligro">
            No se pudieron cargar los productos.
          </p>
        )}

        {products && products.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-tarjeta border border-dashed border-borde bg-white p-10 text-center">
            <p className="font-semibold">
              {estado || linea || test ? "Ningún producto coincide con los filtros." : "Aún no hay productos."}
            </p>
            <ButtonLink href="/admin/productos/nuevo" size="sm">
              Crear el primero
            </ButtonLink>
          </div>
        )}

        {products && products.length > 0 && (
          <div className="overflow-x-auto rounded-tarjeta border border-borde bg-white">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-borde bg-fondo-suave text-xs uppercase text-tinta-suave">
                <tr>
                  <th className="px-4 py-3 font-semibold">Producto</th>
                  <th className="px-4 py-3 font-semibold">Estado</th>
                  <th className="px-4 py-3 font-semibold">Testeo</th>
                  <th className="px-4 py-3 text-right font-semibold">Precio</th>
                  <th className="px-4 py-3 text-right font-semibold">Costo + flete</th>
                  <th className="px-4 py-3 text-right font-semibold">CPA equilibrio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borde">
                {products.map((p) => {
                  const variant = p.product_variants[0];
                  const dropi = one(variant?.dropi_links);
                  const cover = p.product_media.find((m) => m.type === "imagen");
                  const eco =
                    variant && dropi
                      ? computeEconomics({
                          price: variant.price,
                          cost: dropi.cost_price,
                          shipping: dropi.shipping_estimate,
                        })
                      : null;
                  return (
                    <tr key={p.id} className="hover:bg-fondo-suave/60">
                      <td className="px-4 py-3">
                        <Link href={`/admin/productos/${p.id}`} className="flex items-center gap-3">
                          <span className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-borde bg-fondo-suave">
                            {cover && (
                              <Image src={mediaUrl(cover)} alt="" fill sizes="48px" className="object-cover" />
                            )}
                          </span>
                          <span className="flex flex-col">
                            <span className="font-semibold hover:underline">{p.title}</span>
                            <span className="text-xs text-tinta-suave">{LINE_LABEL[p.line]}</span>
                          </span>
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={statusBadge[p.status]}>{STATUS_LABEL[p.status]}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={testBadge[p.test_status]}>{TEST_LABEL[p.test_status]}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {variant ? formatSoles(variant.price) : "—"}
                        {variant?.compare_at_price && (
                          <s className="block text-xs text-tinta-suave">
                            {formatSoles(variant.compare_at_price)}
                          </s>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {dropi ? formatSoles(dropi.cost_price + dropi.shipping_estimate) : "—"}
                      </td>
                      <td
                        className={cn(
                          "px-4 py-3 text-right font-semibold tabular-nums",
                          eco && healthText[eco.health],
                        )}
                      >
                        {eco ? formatSoles(eco.breakEvenCpa) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}

function FilterGroup<T extends string>({
  label,
  current,
  options,
  href,
}: {
  label: string;
  current?: T;
  options: Record<T, string>;
  href: (value?: T) => string;
}) {
  const chip = (active: boolean) =>
    cn(
      "rounded-full border px-3 py-1",
      active ? "border-verde-accion bg-verde-suave text-verde-profundo" : "border-borde bg-white hover:bg-fondo-suave",
    );
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-tinta-suave">{label}:</span>
      <Link href={href(undefined)} className={chip(!current)}>
        Todos
      </Link>
      {(Object.entries(options) as [T, string][]).map(([value, text]) => (
        <Link key={value} href={href(value)} className={chip(current === value)}>
          {text}
        </Link>
      ))}
    </div>
  );
}
