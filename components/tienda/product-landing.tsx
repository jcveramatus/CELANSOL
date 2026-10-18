import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import { LINE_LABEL } from "@/lib/catalog";
import type { LandingProduct } from "@/lib/products/landing";
import { whatsappLink } from "@/lib/whatsapp";
import { formatSoles } from "@/lib/utils";
import { BuyCta, StickyBuyBar } from "./buy-cta";
import { IconCash, IconChat, IconShield, IconTruck } from "./icons";
import { ProductBlocks } from "./product-blocks";
import { ProductGallery } from "./product-gallery";

const BUY_ID = "comprar";

const trust = [
  { icon: IconCash, text: "Pagas al recibir" },
  { icon: IconTruck, text: "Envíos a todo el Perú" },
  { icon: IconChat, text: "Confirmación por WhatsApp" },
  { icon: IconShield, text: "Cambio por fallas de fábrica" },
];

export function ProductLanding({ product }: { product: LandingProduct }) {
  const orderLink = whatsappLink(
    `Hola Celansol, quiero pedir: ${product.title} (${formatSoles(product.price)}). Pago contra entrega.`,
  );

  return (
    <>
      <section className="mx-auto grid w-full max-w-6xl gap-6 px-4 pt-4 pb-10 md:grid-cols-2 md:gap-10 md:pt-10">
        <ProductGallery media={product.media} title={product.title} />

        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap gap-2">
            <Badge variant="envio">{LINE_LABEL[product.line]}</Badge>
            {product.badges.map((b) => (
              <Badge key={b} variant={b === "Top ventas" ? "top" : b === "Últimas unidades" ? "escasez" : "nuevo"}>
                {b}
              </Badge>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold leading-tight sm:text-3xl">{product.title}</h1>
            {product.subtitle && <p className="text-lg text-tinta-suave">{product.subtitle}</p>}
          </div>

          <Price price={product.price} compareAtPrice={product.compareAtPrice} size="lg" />

          <BuyCta id={BUY_ID} href={orderLink} price={product.price} />

          <ul className="grid grid-cols-2 gap-2">
            {trust.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2 rounded-xl bg-fondo-suave px-3 py-2.5 text-xs font-medium sm:text-sm">
                <Icon className="size-5 shrink-0 text-verde-accion" />
                {text}
              </li>
            ))}
          </ul>

          {product.description && (
            <p className="whitespace-pre-line text-tinta-suave">{product.description}</p>
          )}

          {product.specs.length > 0 && (
            <div className="rounded-tarjeta border border-borde">
              <h2 className="border-b border-borde px-4 py-3 text-base font-semibold">Ficha técnica</h2>
              <dl className="divide-y divide-borde text-sm">
                {product.specs.map((s, i) => (
                  <div key={i} className="flex justify-between gap-4 px-4 py-2.5">
                    <dt className="text-tinta-suave">{s.value ? s.label : "•"}</dt>
                    <dd className="text-right font-medium">{s.value || s.label}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </section>

      <ProductBlocks blocks={product.blocks} media={product.media} />

      <section className="bg-white">
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-12 text-center">
          <h2 className="text-2xl font-bold">¿Lo quieres en casa?</h2>
          <Price price={product.price} compareAtPrice={product.compareAtPrice} size="lg" className="justify-center" />
          <BuyCta href={orderLink} price={product.price} />
        </div>
      </section>

      <StickyBuyBar targetId={BUY_ID} href={orderLink} price={product.price} title={product.title} />
    </>
  );
}
