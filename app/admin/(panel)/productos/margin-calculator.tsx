import { computeEconomics } from "@/lib/economics";
import { cn, formatSoles } from "@/lib/utils";

const healthStyle = {
  bueno: { label: "Margen sano", className: "bg-verde-suave text-verde-profundo" },
  justo: { label: "Margen justo", className: "bg-amber-50 text-amber-800" },
  malo: { label: "Margen insuficiente", className: "bg-red-50 text-peligro" },
};

/** Calculadora en vivo: utilidad por entrega, CPA de equilibrio y CPA objetivo. */
export function MarginCalculator({
  price,
  cost,
  shipping,
}: {
  price: number;
  cost: number;
  shipping: number;
}) {
  if (!price || price <= 0) {
    return (
      <p className="text-sm text-tinta-suave">
        Escribe el precio, el costo del proveedor y el flete para ver los números.
      </p>
    );
  }

  const e = computeEconomics({ price, cost, shipping });
  const health = healthStyle[e.health];

  const rows: [string, string, string?][] = [
    ["Comisión de recaudo (3%)", `− ${formatSoles(e.codFee)}`],
    ["Utilidad si se entrega", formatSoles(e.profitIfDelivered)],
    ["Pérdida si se devuelve", `− ${formatSoles(e.lossIfReturned)}`],
    ["Ganancia esperada por pedido", formatSoles(e.expectedPerOrder), "Antes de publicidad"],
    ["Precio ÷ costo", `${e.markup.toFixed(2)}×`, "Meta: 2.5× o más"],
  ];

  return (
    <div className="flex flex-col gap-4">
      <span className={cn("self-start rounded-full px-3 py-1 text-xs font-bold", health.className)}>
        {health.label}
      </span>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-fondo-suave p-3">
          <span className="block text-xs text-tinta-suave">CPA de equilibrio</span>
          <span className="font-display text-2xl font-bold">{formatSoles(e.breakEvenCpa)}</span>
        </div>
        <div className="rounded-xl bg-verde-suave p-3">
          <span className="block text-xs text-verde-profundo">CPA objetivo</span>
          <span className="font-display text-2xl font-bold text-verde-profundo">
            {formatSoles(e.targetCpa)}
          </span>
        </div>
      </div>

      <dl className="flex flex-col gap-2 text-sm">
        {rows.map(([label, value, hint]) => (
          <div key={label} className="flex items-baseline justify-between gap-3">
            <dt className="text-tinta-suave">
              {label}
              {hint && <span className="block text-xs text-tinta-suave/70">{hint}</span>}
            </dt>
            <dd className="font-semibold tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>

      <p className="text-xs text-tinta-suave">
        Supuestos: 85% de pedidos confirmados y 75% entregados. Ajusta con tus datos reales de Dropi.
        Si gastas en ads más que el CPA de equilibrio por pedido, pierdes plata.
      </p>
    </div>
  );
}
