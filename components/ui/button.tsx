import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "whatsapp";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-verde-accion " +
  "disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-verde-accion text-white hover:bg-verde-accion-hover",
  secondary:
    "border-2 border-verde-accion bg-white text-verde-accion hover:bg-verde-suave",
  ghost: "text-tinta hover:bg-fondo-suave",
  whatsapp: "bg-[#25D366] text-[#0b3d1f] hover:bg-[#1fbd5a]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-base",
  lg: "h-14 px-6 text-lg",
};

type StyleProps = { variant?: Variant; size?: Size; fullWidth?: boolean };

export function buttonClasses({
  variant = "primary",
  size = "md",
  fullWidth,
}: StyleProps = {}) {
  return cn(base, variants[variant], sizes[size], fullWidth && "w-full");
}

export function Button({
  variant,
  size,
  fullWidth,
  className,
  type = "button",
  ...props
}: ComponentProps<"button"> & StyleProps) {
  return (
    <button
      type={type}
      className={cn(buttonClasses({ variant, size, fullWidth }), className)}
      {...props}
    />
  );
}

export function ButtonLink({
  variant,
  size,
  fullWidth,
  className,
  ...props
}: ComponentProps<typeof Link> & StyleProps) {
  return (
    <Link
      className={cn(buttonClasses({ variant, size, fullWidth }), className)}
      {...props}
    />
  );
}
