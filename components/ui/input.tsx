"use client";

import { useId, type ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Props = ComponentProps<"input"> & {
  label: string;
  error?: string;
  hint?: string;
};

export function Input({ label, error, hint, className, id, ...props }: Props) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-semibold text-tinta">
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          "h-12 rounded-xl border border-borde bg-white px-4 text-base text-tinta",
          "placeholder:text-tinta-suave/70 focus:border-verde-accion focus:outline-none focus:ring-2 focus:ring-verde-accion/25",
          error && "border-peligro focus:border-peligro focus:ring-peligro/20",
          className,
        )}
        {...props}
      />
      {error ? (
        <p id={`${inputId}-error`} className="text-sm text-peligro">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${inputId}-hint`} className="text-sm text-tinta-suave">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
