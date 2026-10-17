import { cn, discountPercent, formatSoles } from "@/lib/utils";
import { Badge } from "./badge";

type Props = {
  price: number;
  compareAtPrice?: number | null;
  size?: "sm" | "lg";
  className?: string;
};

/** Precio de venta + precio tachado + % de descuento (patrón Enkasa). */
export function Price({ price, compareAtPrice, size = "sm", className }: Props) {
  const percent = discountPercent(price, compareAtPrice);

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span
        className={cn(
          "font-display font-bold text-tinta",
          size === "lg" ? "text-3xl" : "text-lg",
        )}
      >
        <span className="sr-only">Precio de venta: </span>
        {formatSoles(price)}
      </span>
      {percent > 0 && compareAtPrice && (
        <>
          <s className={cn("text-tinta-suave", size === "lg" ? "text-lg" : "text-sm")}>
            <span className="sr-only">Precio regular: </span>
            {formatSoles(compareAtPrice)}
          </s>
          <Badge variant="oferta">-{percent}%</Badge>
        </>
      )}
    </div>
  );
}
