"use client";

import { startTransition, useActionState, useState, useTransition } from "react";
import { PanelCard } from "@/components/admin/panel-card";
import { Button } from "@/components/ui/button";
import { Select, Textarea } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { BLOCK_META, BLOCK_TYPES, type BlockType, type EditableBlock } from "@/lib/blocks";
import { cn } from "@/lib/utils";
import {
  addBlock,
  deleteBlock,
  moveBlock,
  saveBlock,
  toggleBlock,
  type BlockFormState,
} from "./block-actions";

export type EditorBlock = {
  id: string;
  type: BlockType;
  isVisible: boolean;
  values: EditableBlock;
};

type ImageOption = { id: string; label: string };

export function BlocksEditor({
  productId,
  blocks,
  images,
}: {
  productId: string;
  blocks: EditorBlock[];
  images: ImageOption[];
}) {
  const [newType, setNewType] = useState<BlockType>("beneficios");
  const [pending, startAdd] = useTransition();

  return (
    <PanelCard
      title="Bloques de la landing"
      description="Secciones de venta que aparecen debajo del producto, en este orden."
    >
      {blocks.length === 0 && (
        <p className="rounded-xl border border-dashed border-borde p-6 text-center text-sm text-tinta-suave">
          Aún no hay bloques. Recomendado para empezar: Beneficios, Cómo funciona, Comparación y
          Preguntas frecuentes.
        </p>
      )}

      <ol className="flex flex-col gap-3">
        {blocks.map((block, i) => (
          <BlockItem
            key={block.id}
            block={block}
            images={images}
            isFirst={i === 0}
            isLast={i === blocks.length - 1}
          />
        ))}
      </ol>

      <div className="flex flex-wrap items-end gap-3 border-t border-borde pt-4">
        <div className="min-w-48 flex-1">
          <Select
            label="Agregar bloque"
            value={newType}
            onChange={(e) => setNewType(e.target.value as BlockType)}
            options={BLOCK_TYPES.map((t) => ({ value: t, label: BLOCK_META[t].label }))}
            hint={BLOCK_META[newType].help}
          />
        </div>
        <Button
          variant="secondary"
          disabled={pending}
          onClick={() => startAdd(() => addBlock(productId, newType))}
          className="mb-7"
        >
          {pending ? "Agregando…" : "Agregar"}
        </Button>
      </div>
    </PanelCard>
  );
}

function BlockItem({
  block,
  images,
  isFirst,
  isLast,
}: {
  block: EditorBlock;
  images: ImageOption[];
  isFirst: boolean;
  isLast: boolean;
}) {
  const meta = BLOCK_META[block.type];
  const [state, action, saving] = useActionState<BlockFormState, FormData>(
    saveBlock.bind(null, block.id),
    {},
  );
  const [busy, startBusy] = useTransition();

  return (
    <li className={cn("rounded-xl border border-borde", !block.isVisible && "opacity-60")}>
      <details>
        <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-2 px-4 py-3">
          <span className="flex flex-col">
            <span className="text-xs font-semibold uppercase text-tinta-suave">
              {meta.label}
              {!block.isVisible && " · oculto"}
            </span>
            <span className="font-semibold">{block.values.title || "(sin título)"}</span>
          </span>
          <span className="flex gap-1 text-xs" onClick={(e) => e.preventDefault()}>
            <SmallButton label="Subir" disabled={busy || isFirst} onClick={() => startBusy(() => moveBlock(block.id, "up"))}>
              ↑
            </SmallButton>
            <SmallButton label="Bajar" disabled={busy || isLast} onClick={() => startBusy(() => moveBlock(block.id, "down"))}>
              ↓
            </SmallButton>
            <SmallButton
              label={block.isVisible ? "Ocultar" : "Mostrar"}
              disabled={busy}
              onClick={() => startBusy(() => toggleBlock(block.id, !block.isVisible))}
            >
              {block.isVisible ? "Ocultar" : "Mostrar"}
            </SmallButton>
            <SmallButton
              label="Eliminar"
              danger
              disabled={busy}
              onClick={() => {
                if (confirm(`¿Eliminar el bloque “${meta.label}”?`)) startBusy(() => deleteBlock(block.id));
              }}
            >
              Eliminar
            </SmallButton>
          </span>
        </summary>

        <form
          // onSubmit para no vaciar los campos si hay un error (ver product-form).
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            startTransition(() => action(formData));
          }}
          className="flex flex-col gap-4 border-t border-borde px-4 py-4"
        >
          <Input label="Título de la sección" name="title" defaultValue={block.values.title} />

          {block.type === "comparacion" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Columna nuestra" name="usLabel" defaultValue={block.values.usLabel} />
              <Input label="Columna de la competencia" name="themLabel" defaultValue={block.values.themLabel} />
            </div>
          )}

          <Textarea
            label={meta.lineFormat ? "Contenido (una línea por elemento)" : "Texto"}
            name="body"
            defaultValue={block.values.body}
            rows={Math.max(4, block.values.body.split("\n").length + 1)}
            hint={meta.lineFormat ? `Formato: ${meta.lineFormat}` : undefined}
            className="font-mono text-sm"
          />

          {block.type === "texto" && (
            <Select
              label="Imagen"
              name="mediaId"
              defaultValue={block.values.mediaId ?? ""}
              options={[{ value: "", label: "Sin imagen" }, ...images.map((i) => ({ value: i.id, label: i.label }))]}
            />
          )}

          <div className="flex items-center justify-end gap-3">
            {state.message && (
              <p role="status" className={state.ok ? "text-sm text-verde-profundo" : "text-sm text-peligro"}>
                {state.message}
              </p>
            )}
            <Button type="submit" size="sm" disabled={saving}>
              {saving ? "Guardando…" : "Guardar bloque"}
            </Button>
          </div>
        </form>
      </details>
    </li>
  );
}

function SmallButton({
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
        "rounded-md border border-borde bg-white px-2 py-1 hover:bg-fondo-suave disabled:opacity-40",
        danger && "text-peligro hover:bg-red-50",
      )}
      {...props}
    >
      {children}
    </button>
  );
}
