import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StoreFooter } from "@/components/tienda/store-footer";
import { StoreHeader } from "@/components/tienda/store-header";
import { ProductLanding } from "@/components/tienda/product-landing";
import { requireStaff } from "@/lib/auth";
import { STATUS_LABEL } from "@/lib/catalog";
import { LANDING_SELECT, toLandingProduct } from "@/lib/products/landing";
import { createClient } from "@/lib/supabase/server";

// Vista previa interna: depende de la sesión, no se pre-genera.
export const instant = false;

export const metadata: Metadata = {
  title: "Vista previa",
  robots: { index: false, follow: false },
};

export default async function PreviewPage({ params }: PageProps<"/admin/vista-previa/[id]">) {
  await requireStaff();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(`status, ${LANDING_SELECT}`)
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  const product = toLandingProduct(data);

  return (
    <>
      <div className="bg-tinta px-4 py-2 text-center text-sm text-white">
        Vista previa · Estado: <strong>{STATUS_LABEL[data.status]}</strong>
        {data.status !== "activo" && " (los clientes aún no la ven)"} ·{" "}
        <Link href={`/admin/productos/${id}`} className="underline">
          Volver a editar
        </Link>
      </div>
      <StoreHeader />
      <div className="flex flex-1 flex-col">
        <ProductLanding product={product} />
      </div>
      <StoreFooter />
    </>
  );
}
