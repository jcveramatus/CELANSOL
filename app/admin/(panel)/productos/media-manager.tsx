"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { PanelCard } from "@/components/admin/panel-card";
import { Button } from "@/components/ui/button";
import type { MediaContext } from "@/lib/catalog";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { addMedia, deleteMedia, moveMedia, setMediaContext, updateMediaAlt } from "./actions";

export type MediaItem = {
  id: string;
  url: string;
  type: "imagen" | "video";
  context: MediaContext;
  alt: string;
};

const MAX_SIDE = 1600;
const MAX_VIDEO_MB = 50;

/** Redimensiona a máx. 1600 px y convierte a WebP. */
async function toWebp(file: File) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("No se pudo convertir"))), "image/webp", 0.85),
  );
  return { blob, width, height };
}

const CONTEXTS: { value: MediaContext; label: string; hint: string }[] = [
  { value: "producto", label: "Fotos del producto", hint: "La primera es la portada." },
  {
    value: "en_uso",
    label: "En uso",
    hint: "El producto funcionando en una casa o con la mascota. Alimenta el botón “Ver en uso”.",
  },
];

export function MediaManager({ productId, media }: { productId: string; media: MediaItem[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {CONTEXTS.map((ctx) => (
        <MediaGroup
          key={ctx.value}
          productId={productId}
          context={ctx.value}
          title={ctx.label}
          hint={ctx.hint}
          items={media.filter((m) => m.context === ctx.value)}
        />
      ))}
    </div>
  );
}

function MediaGroup({
  productId,
  context,
  title,
  hint,
  items,
}: {
  productId: string;
  context: MediaContext;
  title: string;
  hint: string;
  items: MediaItem[];
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setError(null);
    const supabase = createClient();

    for (const [index, file] of [...files].entries()) {
      setUploading(`Subiendo ${index + 1} de ${files.length}…`);
      try {
        const isVideo = file.type.startsWith("video/");
        let body: Blob = file;
        let width: number | undefined;
        let height: number | undefined;
        let ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";

        if (isVideo) {
          if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
            throw new Error(`El video pesa más de ${MAX_VIDEO_MB} MB`);
          }
        } else {
          ({ blob: body, width, height } = await toWebp(file));
          ext = "webp";
        }

        const path = `${productId}/${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("productos")
          .upload(path, body, { contentType: isVideo ? file.type : "image/webp", cacheControl: "31536000" });
        if (uploadError) throw new Error(uploadError.message);

        await addMedia({
          productId,
          storagePath: path,
          type: isVideo ? "video" : "imagen",
          context,
          width,
          height,
        });
      } catch (e) {
        setError(`“${file.name}”: ${e instanceof Error ? e.message : "no se pudo subir"}`);
      }
    }
    setUploading(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  const busy = Boolean(uploading) || isPending;

  return (
    <PanelCard title={title} description={hint}>
      {items.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((item, i) => (
            <li key={item.id} className="flex flex-col gap-2">
              <div
                className={cn(
                  "relative aspect-square overflow-hidden rounded-xl border bg-fondo-suave",
                  i === 0 && context === "producto" ? "border-verde-accion" : "border-borde",
                )}
              >
                {item.type === "video" ? (
                  <video src={item.url} className="size-full object-cover" muted playsInline />
                ) : (
                  <Image
                    src={item.url}
                    alt={item.alt || `Foto ${i + 1}`}
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                )}
                {i === 0 && context === "producto" && (
                  <span className="absolute left-2 top-2 rounded-full bg-verde-accion px-2 py-0.5 text-[10px] font-bold text-white">
                    Portada
                  </span>
                )}
              </div>
              <input
                aria-label={`Texto alternativo de la foto ${i + 1}`}
                defaultValue={item.alt}
                placeholder="Describe la foto"
                onBlur={(e) => {
                  if (e.target.value !== item.alt) updateMediaAlt(item.id, e.target.value);
                }}
                className="h-8 rounded-lg border border-borde px-2 text-xs"
              />
              <div className="flex flex-wrap gap-1 text-xs">
                <IconButton
                  label="Mover antes"
                  disabled={busy || i === 0}
                  onClick={() => startTransition(() => moveMedia(item.id, "up"))}
                >
                  ←
                </IconButton>
                <IconButton
                  label="Mover después"
                  disabled={busy || i === items.length - 1}
                  onClick={() => startTransition(() => moveMedia(item.id, "down"))}
                >
                  →
                </IconButton>
                <IconButton
                  label={context === "producto" ? "Pasar a En uso" : "Pasar a Fotos del producto"}
                  disabled={busy}
                  onClick={() =>
                    startTransition(() =>
                      setMediaContext(item.id, context === "producto" ? "en_uso" : "producto"),
                    )
                  }
                >
                  {context === "producto" ? "En uso" : "Producto"}
                </IconButton>
                <IconButton
                  label="Eliminar"
                  danger
                  disabled={busy}
                  onClick={() => {
                    if (confirm("¿Eliminar este archivo?")) startTransition(() => deleteMedia(item.id));
                  }}
                >
                  Eliminar
                </IconButton>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl border border-dashed border-borde p-6 text-center text-sm text-tinta-suave">
          Aún no hay archivos.
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm"
        multiple
        hidden
        onChange={(e) => onFiles(e.target.files)}
      />
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="secondary" size="sm" disabled={busy} onClick={() => inputRef.current?.click()}>
          {uploading ?? "Subir fotos o videos"}
        </Button>
        <span className="text-xs text-tinta-suave">
          Las fotos se convierten a WebP (máx. 1600 px). Videos MP4 hasta {MAX_VIDEO_MB} MB.
        </span>
      </div>
      {error && (
        <p role="alert" className="text-sm text-peligro">
          {error}
        </p>
      )}
    </PanelCard>
  );
}

function IconButton({
  label,
  danger,
  children,
  ...props
}: React.ComponentProps<"button"> & { label: string; danger?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "rounded-md border border-borde px-2 py-1 hover:bg-fondo-suave disabled:opacity-40",
        danger && "text-peligro hover:bg-red-50",
      )}
      {...props}
    >
      {children}
    </button>
  );
}
