import { cn } from "@/lib/utils";

type Props = {
  /** "color" para fondos claros, "blanco" para fondos verdes. */
  tone?: "color" | "blanco";
  className?: string;
};

/**
 * Logotipo provisional: wordmark + los tres trazos del sol del logo.
 * Reemplazar por el SVG oficial en /public/marca cuando llegue.
 */
export function Logo({ tone = "color", className }: Props) {
  const color = tone === "blanco" ? "text-white" : "text-verde-accion";

  return (
    <span
      className={cn("inline-flex items-end font-display font-bold leading-none", color, className)}
      aria-label="Celansol"
      role="img"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="mb-[0.55em] -mr-[0.05em] h-[0.6em] w-[0.6em]"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      >
        <line x1="17" y1="3" x2="20" y2="11" />
        <line x1="6" y1="7" x2="12" y2="12" />
        <line x1="2" y1="19" x2="10" y2="19" />
      </svg>
      <span aria-hidden="true" className="tracking-tight">
        Celansol
      </span>
    </span>
  );
}
