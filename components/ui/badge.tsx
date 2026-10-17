import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Variant = "oferta" | "nuevo" | "top" | "envio" | "escasez" | "neutral";

const variants: Record<Variant, string> = {
  oferta: "bg-oferta text-oferta-texto",
  nuevo: "bg-verde-accion text-white",
  top: "bg-tinta text-white",
  envio: "bg-verde-suave text-verde-profundo",
  escasez: "bg-red-50 text-peligro",
  neutral: "bg-fondo-suave text-tinta-suave",
};

export function Badge({
  variant = "neutral",
  className,
  ...props
}: ComponentProps<"span"> & { variant?: Variant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
