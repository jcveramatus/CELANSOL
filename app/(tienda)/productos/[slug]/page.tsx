import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductLanding } from "@/components/tienda/product-landing";
import { getPublicProduct } from "@/lib/products/public";

export async function generateMetadata({
  params,
}: PageProps<"/productos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublicProduct(slug);
  if (!product) return { title: "Producto no encontrado" };

  const cover = product.media.find((m) => m.context === "producto" && m.type === "imagen");
  const description = product.seoDescription ?? product.subtitle ?? product.description?.slice(0, 155) ?? undefined;
  return {
    title: product.seoTitle ?? product.title,
    description,
    openGraph: {
      title: product.seoTitle ?? product.title,
      description,
      images: cover ? [{ url: cover.url, width: cover.width ?? undefined, height: cover.height ?? undefined }] : [],
    },
  };
}

// params se lee dentro de <Suspense>: Next sirve al instante el esqueleto (App Shell)
// y la versión de cada producto queda en caché hasta que el panel la invalide.
export default function ProductPage({ params }: PageProps<"/productos/[slug]">) {
  return (
    <Suspense fallback={<LandingSkeleton />}>
      <ProductContent params={params} />
    </Suspense>
  );
}

async function ProductContent({ params }: Pick<PageProps<"/productos/[slug]">, "params">) {
  const { slug } = await params;
  const product = await getPublicProduct(slug);
  if (!product) notFound();
  return <ProductLanding product={product} />;
}

function LandingSkeleton() {
  return (
    <div aria-busy="true" className="mx-auto grid w-full max-w-6xl animate-pulse gap-6 px-4 pt-4 md:grid-cols-2 md:gap-10 md:pt-10">
      <span className="sr-only">Cargando producto…</span>
      <div className="aspect-square rounded-tarjeta bg-fondo-suave" />
      <div className="flex flex-col gap-4">
        <div className="h-5 w-24 rounded-full bg-fondo-suave" />
        <div className="h-8 w-4/5 rounded-lg bg-fondo-suave" />
        <div className="h-6 w-2/3 rounded bg-fondo-suave" />
        <div className="h-10 w-40 rounded bg-fondo-suave" />
        <div className="h-14 rounded-xl bg-fondo-suave" />
      </div>
    </div>
  );
}
