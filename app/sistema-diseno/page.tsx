import type { Metadata } from "next";
import { Logo } from "@/components/marca/logo";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Price } from "@/components/ui/price";

export const metadata: Metadata = {
  title: "Sistema de diseño",
  robots: { index: false, follow: false },
};

const colors = [
  ["verde-brillo", "bg-verde-brillo", "Decoración y degradados"],
  ["verde", "bg-verde", "Títulos grandes, íconos"],
  ["verde-accion", "bg-verde-accion", "Botones y links (AA)"],
  ["verde-profundo", "bg-verde-profundo", "Header, footer, hover"],
  ["verde-suave", "bg-verde-suave", "Fondos de beneficios"],
  ["tinta", "bg-tinta", "Texto principal"],
  ["tinta-suave", "bg-tinta-suave", "Texto secundario"],
  ["fondo-suave", "bg-fondo-suave", "Secciones alternas"],
  ["oferta", "bg-oferta", "Descuentos y contadores"],
  ["peligro", "bg-peligro", "Errores y escasez"],
] as const;

export default function DesignSystemPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-14 px-4 py-12">
      <header className="flex flex-col gap-2">
        <Logo className="text-4xl" />
        <p className="text-tinta-suave">
          Sistema de diseño de la tienda. Página interna (no se indexa).
        </p>
      </header>

      <Section title="Colores">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {colors.map(([name, bg, use]) => (
            <li key={name} className="flex flex-col gap-2">
              <div className={`h-16 rounded-xl border border-borde ${bg}`} />
              <code className="text-xs font-semibold">{name}</code>
              <span className="text-xs text-tinta-suave">{use}</span>
            </li>
          ))}
        </ul>
        <div className="bg-marca mt-6 flex h-28 items-center justify-center rounded-tarjeta">
          <Logo tone="blanco" className="text-4xl" />
        </div>
      </Section>

      <Section title="Tipografía">
        <h1 className="text-4xl font-bold">Poppins para títulos</h1>
        <h2 className="text-2xl font-semibold">Ordena tu cocina en 5 minutos</h2>
        <p className="max-w-prose text-tinta-suave">
          Inter para el cuerpo del texto. Se lee bien en el celular, que es por donde entra casi
          todo el tráfico de anuncios.
        </p>
      </Section>

      <Section title="Botones">
        <div className="flex flex-wrap items-center gap-3">
          <Button size="lg">Pedir ahora · Pago contra entrega</Button>
          <Button variant="secondary">Agregar al carrito</Button>
          <Button variant="ghost">Ver detalles</Button>
          <ButtonLink href="/" variant="whatsapp">
            Escríbenos por WhatsApp
          </ButtonLink>
          <Button disabled>Deshabilitado</Button>
        </div>
      </Section>

      <Section title="Badges">
        <div className="flex flex-wrap gap-2">
          <Badge variant="oferta">-40%</Badge>
          <Badge variant="nuevo">Nuevo</Badge>
          <Badge variant="top">Top ventas</Badge>
          <Badge variant="envio">Llega en 24-72 h</Badge>
          <Badge variant="escasez">¡Quedan pocos!</Badge>
          <Badge>Mascotas</Badge>
        </div>
      </Section>

      <Section title="Precios">
        <div className="flex flex-col gap-3">
          <Price price={89.9} compareAtPrice={149} size="lg" />
          <Price price={39.9} compareAtPrice={59} />
          <Price price={24.9} />
        </div>
      </Section>

      <Section title="Formulario">
        <div className="grid max-w-md gap-4">
          <Input label="Nombre y apellido" placeholder="Ana Torres" autoComplete="name" />
          <Input
            label="Celular"
            inputMode="numeric"
            placeholder="9XX XXX XXX"
            hint="Te escribiremos por WhatsApp para confirmar tu pedido"
          />
          <Input label="Dirección" defaultValue="Av. Siempre Viva" error="Agrega número de casa o lote" />
        </div>
      </Section>

      <Section title="Tarjeta de producto">
        <article className="w-64 overflow-hidden rounded-tarjeta border border-borde">
          <div className="relative aspect-square bg-fondo-suave">
            <Badge variant="oferta" className="absolute left-3 top-3">
              -40%
            </Badge>
          </div>
          <div className="flex flex-col gap-2 p-4">
            <Badge variant="envio" className="self-start">
              Pagas al recibir
            </Badge>
            <h3 className="font-semibold leading-snug">Fuente de agua automática para gatos 2.5 L</h3>
            <Price price={89.9} compareAtPrice={149} />
            <Button fullWidth>Pedir ahora</Button>
          </div>
        </article>
      </Section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="border-b border-borde pb-2 text-xl font-bold">{title}</h2>
      {children}
    </section>
  );
}
