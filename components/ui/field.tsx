"use client";

import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const controlBase =
  "rounded-xl border border-borde bg-white px-4 text-base text-tinta " +
  "placeholder:text-tinta-suave/70 focus:border-verde-accion focus:outline-none focus:ring-2 focus:ring-verde-accion/25";
const controlError = "border-peligro focus:border-peligro focus:ring-peligro/20";

type FieldProps = { label: string; error?: string; hint?: string };

function FieldShell({
  id,
  label,
  error,
  hint,
  children,
}: FieldProps & { id: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-tinta">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-peligro">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="text-sm text-tinta-suave">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

function describedBy(id: string, error?: string, hint?: string) {
  return error ? `${id}-error` : hint ? `${id}-hint` : undefined;
}

export function Textarea({
  label,
  error,
  hint,
  className,
  id,
  ...props
}: ComponentProps<"textarea"> & FieldProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <FieldShell id={fieldId} label={label} error={error} hint={hint}>
      <textarea
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(fieldId, error, hint)}
        className={cn(controlBase, "min-h-28 py-3", error && controlError, className)}
        {...props}
      />
    </FieldShell>
  );
}

export function Select({
  label,
  error,
  hint,
  className,
  id,
  options,
  ...props
}: ComponentProps<"select"> & FieldProps & { options: { value: string; label: string }[] }) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <FieldShell id={fieldId} label={label} error={error} hint={hint}>
      <select
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(fieldId, error, hint)}
        className={cn(controlBase, "h-12", error && controlError, className)}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}
