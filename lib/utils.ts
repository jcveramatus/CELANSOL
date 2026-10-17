import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const soles = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
});

/** Solo para mostrar. Los montos que se cobran se calculan en el servidor. */
export function formatSoles(amount: number) {
  return soles.format(amount);
}

/** % de descuento redondeado hacia abajo, para no prometer de más. */
export function discountPercent(price: number, compareAtPrice?: number | null) {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.floor(((compareAtPrice - price) / compareAtPrice) * 100);
}
