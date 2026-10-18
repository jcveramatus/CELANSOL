import type { Database } from "@/lib/supabase/database.types";

export type ProductStatus = Database["public"]["Enums"]["product_status"];
export type ProductLine = Database["public"]["Enums"]["product_line"];
export type TestStatus = Database["public"]["Enums"]["test_status"];
export type MediaContext = Database["public"]["Enums"]["media_context"];

export const STATUS_LABEL: Record<ProductStatus, string> = {
  borrador: "Borrador",
  activo: "Activo",
  archivado: "Archivado",
};

export const LINE_LABEL: Record<ProductLine, string> = {
  hogar: "Hogar",
  mascotas: "Mascotas",
};

export const TEST_LABEL: Record<TestStatus, string> = {
  sin_testear: "Sin testear",
  en_test: "En test",
  ganador: "Ganador",
  pausado: "Pausado",
  descartado: "Descartado",
};

export const BADGE_OPTIONS = ["Top ventas", "Nuevo", "Últimas unidades", "Combo"] as const;

/** "Fuente para Gatos 2.5L" → "fuente-para-gatos-2-5l" */
export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** URL pública de un archivo del bucket "productos". */
export function mediaUrl(media: { storage_path: string | null; url: string | null }) {
  if (media.url) return media.url;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/productos/${media.storage_path}`;
}

/** Especificaciones: "Capacidad: 2.5 L" por línea ⇄ [{label, value}]. */
export type Spec = { label: string; value: string };

export function parseSpecs(text: string): Spec[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const i = line.indexOf(":");
      return i === -1
        ? { label: line, value: "" }
        : { label: line.slice(0, i).trim(), value: line.slice(i + 1).trim() };
    });
}

export function specsToText(specs: unknown): string {
  if (!Array.isArray(specs)) return "";
  return specs
    .map((s: Partial<Spec>) => (s.value ? `${s.label}: ${s.value}` : (s.label ?? "")))
    .join("\n");
}

/** PostgREST devuelve relaciones 1:1 como objeto o arreglo según el caso. */
export function one<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}
