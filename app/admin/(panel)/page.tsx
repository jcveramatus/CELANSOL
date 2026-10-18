import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { ButtonLink } from "@/components/ui/button";
import { requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function AdminHomePage() {
  const staff = await requireStaff();
  const supabase = await createClient();

  const [{ count: activos }, { count: enTest }, { count: pedidos }] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }).eq("status", "activo"),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("test_status", "en_test"),
    supabase.from("orders").select("id", { count: "exact", head: true }),
  ]);

  const cards = [
    { label: "Productos activos", value: activos ?? 0, href: "/admin/productos?estado=activo" },
    { label: "Productos en test", value: enTest ?? 0, href: "/admin/productos?test=en_test" },
    { label: "Pedidos totales", value: pedidos ?? 0 },
  ];

  return (
    <>
      <PageHeader
        title={`Hola, ${staff.fullName.split(" ")[0]}`}
        description="Resumen rápido de la tienda. El dashboard de ventas llega en la versión v0.2."
        actions={<ButtonLink href="/admin/productos/nuevo">Nuevo producto</ButtonLink>}
      />
      <main className="grid gap-4 p-4 sm:grid-cols-3 md:p-8">
        {cards.map((card) => {
          const body = (
            <>
              <span className="text-sm text-tinta-suave">{card.label}</span>
              <span className="font-display text-3xl font-bold">{card.value}</span>
            </>
          );
          return card.href ? (
            <Link
              key={card.label}
              href={card.href}
              className="flex flex-col gap-1 rounded-tarjeta border border-borde bg-white p-5 hover:border-verde-accion"
            >
              {body}
            </Link>
          ) : (
            <div key={card.label} className="flex flex-col gap-1 rounded-tarjeta border border-borde bg-white p-5">
              {body}
            </div>
          );
        })}
      </main>
    </>
  );
}
