import { z } from "zod";

/**
 * Bloques de la landing de producto. Se guardan como JSON estructurado en
 * product_blocks.data y se editan en el panel como texto simple: una línea
 * por elemento, con columnas separadas por "|".
 */

const str = z.string().trim();

export const blockSchemas = {
  beneficios: z.object({
    title: str,
    items: z.array(z.object({ icon: str, title: str, text: str })).min(1),
  }),
  pasos: z.object({
    title: str,
    items: z.array(z.object({ title: str, text: str })).min(1),
  }),
  comparacion: z.object({
    title: str,
    usLabel: str,
    themLabel: str,
    rows: z.array(z.object({ feature: str, us: z.boolean(), them: z.boolean() })).min(1),
  }),
  incluye: z.object({
    title: str,
    items: z.array(str).min(1),
  }),
  faq: z.object({
    title: str,
    items: z.array(z.object({ q: str, a: str })).min(1),
  }),
  garantia: z.object({
    title: str,
    text: str.min(1),
  }),
  texto: z.object({
    title: str,
    text: str.min(1),
    mediaId: z.string().nullable(),
  }),
} as const;

export type BlockType = keyof typeof blockSchemas;
export type BlockData<T extends BlockType> = z.infer<(typeof blockSchemas)[T]>;
export const BLOCK_TYPES = Object.keys(blockSchemas) as BlockType[];

export function isBlockType(value: string): value is BlockType {
  return value in blockSchemas;
}

/** Lo que se edita en el panel. */
export type EditableBlock = {
  title: string;
  body: string;
  usLabel?: string;
  themLabel?: string;
  mediaId?: string | null;
};

type BlockMeta = {
  label: string;
  help: string;
  /** Formato de cada línea del cuerpo (vacío = texto libre). */
  lineFormat: string;
  template: EditableBlock;
};

export const BLOCK_META: Record<BlockType, BlockMeta> = {
  beneficios: {
    label: "Beneficios",
    help: "3 o 4 beneficios con ícono. Lo que gana el cliente, no características.",
    lineFormat: "emoji | título | texto",
    template: {
      title: "¿Por qué te va a encantar?",
      body: [
        "⚡ | Ahorra tiempo | Explica en una frase qué tarea le resuelve",
        "🧼 | Fácil de limpiar | Explica por qué no da trabajo",
        "🏠 | Se ve bien en casa | Diseño moderno que combina con todo",
      ].join("\n"),
    },
  },
  pasos: {
    label: "Cómo funciona",
    help: "Pasos cortos para usarlo. Quita miedos de 'será complicado'.",
    lineFormat: "título | texto",
    template: {
      title: "Así de fácil se usa",
      body: ["Lo conectas | Sin instalación", "Lo enciendes | Un solo botón", "Listo | Disfruta el resultado"].join(
        "\n",
      ),
    },
  },
  comparacion: {
    label: "Comparación",
    help: "Tu producto vs. la alternativa de siempre. Marca con sí / no.",
    lineFormat: "característica | sí/no (nosotros) | sí/no (otros)",
    template: {
      title: "Celansol vs. lo de siempre",
      usLabel: "Celansol",
      themLabel: "Lo de siempre",
      body: ["Pagas al recibir | sí | no", "Fácil de usar | sí | no", "Garantía | sí | no"].join("\n"),
    },
  },
  incluye: {
    label: "Qué incluye",
    help: "Contenido de la caja. Una cosa por línea.",
    lineFormat: "elemento",
    template: { title: "¿Qué recibes?", body: ["1 producto", "1 cable de carga", "Manual en español"].join("\n") },
  },
  faq: {
    label: "Preguntas frecuentes",
    help: "Responde las dudas que frenan la compra.",
    lineFormat: "pregunta | respuesta",
    template: {
      title: "Preguntas frecuentes",
      body: [
        "¿Cómo pago? | Pagas cuando recibes tu pedido.",
        "¿Llega a provincia? | Sí, enviamos a todo el Perú.",
        "¿Cómo confirmo mi pedido? | Te escribimos por WhatsApp antes de enviarlo.",
      ].join("\n"),
    },
  },
  garantia: {
    label: "Garantía",
    help: "Qué pasa si algo sale mal. Debe coincidir con lo que acepta el proveedor.",
    lineFormat: "",
    template: {
      title: "Compra con tranquilidad",
      body: "Si tu producto llega con fallas de fábrica, te lo cambiamos. Escríbenos por WhatsApp y te ayudamos.",
    },
  },
  texto: {
    label: "Texto con imagen",
    help: "Un mensaje de venta con una foto del producto (opcional).",
    lineFormat: "",
    template: {
      title: "Hecho para tu día a día",
      body: "Cuenta la historia: el problema que tenía tu cliente y cómo este producto lo resuelve.",
      mediaId: null,
    },
  },
};

const splitLines = (body: string) =>
  body
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
const cols = (line: string) => line.split("|").map((c) => c.trim());
const yes = (v: string | undefined) => /^(s[ií]|si|yes|x|✓|✅|1|true)$/i.test(v ?? "");
const yesNo = (v: boolean) => (v ? "sí" : "no");

/** Texto del panel → datos validados. Devuelve error legible si no cuadra. */
export function parseBlock(
  type: BlockType,
  input: EditableBlock,
): { ok: true; data: BlockData<BlockType> } | { ok: false; error: string } {
  const title = input.title.trim();
  const lines = splitLines(input.body);
  let raw: unknown;

  switch (type) {
    case "beneficios":
      raw = {
        title,
        items: lines.map((l) => {
          const [icon = "", t = "", text = ""] = cols(l);
          return { icon, title: t, text };
        }),
      };
      break;
    case "pasos":
      raw = { title, items: lines.map((l) => ({ title: cols(l)[0] ?? "", text: cols(l)[1] ?? "" })) };
      break;
    case "comparacion":
      raw = {
        title,
        usLabel: input.usLabel?.trim() || "Celansol",
        themLabel: input.themLabel?.trim() || "Otros",
        rows: lines.map((l) => {
          const [feature = "", us, them] = cols(l);
          return { feature, us: yes(us), them: yes(them) };
        }),
      };
      break;
    case "incluye":
      raw = { title, items: lines };
      break;
    case "faq":
      raw = { title, items: lines.map((l) => ({ q: cols(l)[0] ?? "", a: cols(l).slice(1).join(" | ") })) };
      break;
    case "garantia":
      raw = { title, text: input.body.trim() };
      break;
    case "texto":
      raw = { title, text: input.body.trim(), mediaId: input.mediaId || null };
      break;
  }

  const parsed = blockSchemas[type].safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: lines.length === 0 && type !== "garantia" && type !== "texto"
        ? "Agrega al menos una línea."
        : "Revisa el formato de las líneas.",
    };
  }
  return { ok: true, data: parsed.data };
}

/** Datos guardados → texto del panel. */
export function toEditable(type: BlockType, data: unknown): EditableBlock {
  const parsed = blockSchemas[type].safeParse(data);
  if (!parsed.success) return BLOCK_META[type].template;
  const d = parsed.data;

  switch (type) {
    case "beneficios": {
      const b = d as BlockData<"beneficios">;
      return { title: b.title, body: b.items.map((i) => `${i.icon} | ${i.title} | ${i.text}`).join("\n") };
    }
    case "pasos": {
      const b = d as BlockData<"pasos">;
      return { title: b.title, body: b.items.map((i) => `${i.title} | ${i.text}`).join("\n") };
    }
    case "comparacion": {
      const b = d as BlockData<"comparacion">;
      return {
        title: b.title,
        usLabel: b.usLabel,
        themLabel: b.themLabel,
        body: b.rows.map((r) => `${r.feature} | ${yesNo(r.us)} | ${yesNo(r.them)}`).join("\n"),
      };
    }
    case "incluye": {
      const b = d as BlockData<"incluye">;
      return { title: b.title, body: b.items.join("\n") };
    }
    case "faq": {
      const b = d as BlockData<"faq">;
      return { title: b.title, body: b.items.map((i) => `${i.q} | ${i.a}`).join("\n") };
    }
    case "garantia": {
      const b = d as BlockData<"garantia">;
      return { title: b.title, body: b.text };
    }
    case "texto": {
      const b = d as BlockData<"texto">;
      return { title: b.title, body: b.text, mediaId: b.mediaId };
    }
  }
}
