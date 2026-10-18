import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { CATALOG_EDITORS, requireStaff } from "@/lib/auth";
import { ProductForm } from "../product-form";
import { EMPTY_PRODUCT } from "../product-form-values";

export const metadata: Metadata = { title: "Nuevo producto" };

export default async function NewProductPage() {
  await requireStaff(CATALOG_EDITORS);

  return (
    <>
      <PageHeader
        title="Nuevo producto"
        description="Después de crearlo podrás subir fotos y videos."
        actions={
          <Link href="/admin/productos" className="text-sm text-tinta-suave underline">
            Volver a productos
          </Link>
        }
      />
      <main className="p-4 md:p-8">
        <ProductForm initial={EMPTY_PRODUCT} />
      </main>
    </>
  );
}
