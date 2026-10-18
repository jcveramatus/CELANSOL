import Image from "next/image";
import { blockSchemas, type BlockData } from "@/lib/blocks";
import type { LandingBlock, LandingMedia } from "@/lib/products/landing";
import { IconCheck, IconX } from "./icons";

function Section({ title, children, tone = "blanco" }: { title: string; children: React.ReactNode; tone?: "blanco" | "suave" }) {
  return (
    <section className={tone === "suave" ? "bg-fondo-suave" : "bg-white"}>
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-12">
        {title && <h2 className="text-center text-2xl font-bold sm:text-3xl">{title}</h2>}
        {children}
      </div>
    </section>
  );
}

function Beneficios({ data }: { data: BlockData<"beneficios"> }) {
  return (
    <Section title={data.title} tone="suave">
      <ul className="grid gap-4 sm:grid-cols-2">
        {data.items.map((item, i) => (
          <li key={i} className="flex gap-4 rounded-tarjeta bg-white p-5">
            <span className="text-3xl leading-none" aria-hidden="true">
              {item.icon}
            </span>
            <div>
              <h3 className="font-semibold">{item.title}</h3>
              {item.text && <p className="mt-1 text-sm text-tinta-suave">{item.text}</p>}
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Pasos({ data }: { data: BlockData<"pasos"> }) {
  return (
    <Section title={data.title}>
      <ol className="grid gap-4 sm:grid-cols-3">
        {data.items.map((item, i) => (
          <li key={i} className="flex flex-col items-center gap-2 text-center">
            <span className="flex size-10 items-center justify-center rounded-full bg-verde-accion font-display font-bold text-white">
              {i + 1}
            </span>
            <h3 className="font-semibold">{item.title}</h3>
            {item.text && <p className="text-sm text-tinta-suave">{item.text}</p>}
          </li>
        ))}
      </ol>
    </Section>
  );
}

function Mark({ ok, label }: { ok: boolean; label: string }) {
  return ok ? (
    <IconCheck className="mx-auto size-5 text-verde-accion" aria-label={`${label}: sí`} />
  ) : (
    <IconX className="mx-auto size-5 text-peligro" aria-label={`${label}: no`} />
  );
}

function Comparacion({ data }: { data: BlockData<"comparacion"> }) {
  return (
    <Section title={data.title} tone="suave">
      <div className="overflow-hidden rounded-tarjeta border border-borde bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-borde">
              <th className="p-3 text-left font-semibold">
                <span className="sr-only">Característica</span>
              </th>
              <th className="bg-verde-suave p-3 font-bold text-verde-profundo">{data.usLabel}</th>
              <th className="p-3 font-semibold text-tinta-suave">{data.themLabel}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borde">
            {data.rows.map((row, i) => (
              <tr key={i}>
                <th scope="row" className="p-3 text-left font-medium">
                  {row.feature}
                </th>
                <td className="bg-verde-suave/50 p-3">
                  <Mark ok={row.us} label={data.usLabel} />
                </td>
                <td className="p-3">
                  <Mark ok={row.them} label={data.themLabel} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

function Incluye({ data }: { data: BlockData<"incluye"> }) {
  return (
    <Section title={data.title}>
      <ul className="mx-auto flex w-full max-w-md flex-col gap-2">
        {data.items.map((item, i) => (
          <li key={i} className="flex items-center gap-3 rounded-xl border border-borde px-4 py-3">
            <IconCheck className="size-5 shrink-0 text-verde-accion" />
            {item}
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Faq({ data }: { data: BlockData<"faq"> }) {
  return (
    <Section title={data.title} tone="suave">
      <div className="flex flex-col gap-2">
        {data.items.map((item, i) => (
          <details key={i} className="group rounded-xl border border-borde bg-white px-4 py-3">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
              {item.q}
              <span className="text-xl text-tinta-suave transition-transform group-open:rotate-45" aria-hidden="true">
                +
              </span>
            </summary>
            <p className="mt-2 text-sm text-tinta-suave">{item.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}

function Garantia({ data }: { data: BlockData<"garantia"> }) {
  return (
    <Section title="">
      <div className="flex flex-col items-center gap-3 rounded-tarjeta border-2 border-verde-accion/30 bg-verde-suave p-6 text-center">
        <h2 className="text-xl font-bold text-verde-profundo">{data.title}</h2>
        <p className="max-w-prose text-tinta">{data.text}</p>
      </div>
    </Section>
  );
}

function Texto({ data, media }: { data: BlockData<"texto">; media: LandingMedia[] }) {
  const image = data.mediaId ? media.find((m) => m.id === data.mediaId && m.type === "imagen") : undefined;
  return (
    <Section title="">
      <div className={image ? "grid items-center gap-6 sm:grid-cols-2" : ""}>
        {image && (
          <div className="relative aspect-square overflow-hidden rounded-tarjeta bg-fondo-suave">
            <Image src={image.url} alt={image.alt || data.title} fill sizes="(min-width: 640px) 360px, 100vw" className="object-cover" />
          </div>
        )}
        <div className="flex flex-col gap-3">
          {data.title && <h2 className="text-2xl font-bold">{data.title}</h2>}
          <p className="whitespace-pre-line text-tinta-suave">{data.text}</p>
        </div>
      </div>
    </Section>
  );
}

export function ProductBlocks({ blocks, media }: { blocks: LandingBlock[]; media: LandingMedia[] }) {
  return blocks.map((block) => {
    const parsed = blockSchemas[block.type].safeParse(block.data);
    if (!parsed.success) return null;
    switch (block.type) {
      case "beneficios":
        return <Beneficios key={block.id} data={parsed.data as BlockData<"beneficios">} />;
      case "pasos":
        return <Pasos key={block.id} data={parsed.data as BlockData<"pasos">} />;
      case "comparacion":
        return <Comparacion key={block.id} data={parsed.data as BlockData<"comparacion">} />;
      case "incluye":
        return <Incluye key={block.id} data={parsed.data as BlockData<"incluye">} />;
      case "faq":
        return <Faq key={block.id} data={parsed.data as BlockData<"faq">} />;
      case "garantia":
        return <Garantia key={block.id} data={parsed.data as BlockData<"garantia">} />;
      case "texto":
        return <Texto key={block.id} data={parsed.data as BlockData<"texto">} media={media} />;
    }
  });
}
