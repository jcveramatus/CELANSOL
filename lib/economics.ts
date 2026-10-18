/**
 * Unit economics de dropshipping COD con Dropi (ver plan, sección 2).
 * Supuestos por defecto conservadores; ajustarlos con datos reales de Dropi.
 */
export const ECONOMICS_DEFAULTS = {
  /** Comisión de recaudo contra entrega sobre el precio de venta (%). */
  codFeePercent: 3,
  /** Pedidos confirmados / pedidos creados. */
  confirmationRate: 0.85,
  /** Pedidos entregados / pedidos despachados. */
  deliveryRate: 0.75,
  /** El CPA objetivo deja este % del equilibrio como ganancia: objetivo = equilibrio × factor. */
  targetFactor: 0.6,
} as const;

export type EconomicsInput = {
  price: number;
  cost: number;
  shipping: number;
  codFeePercent?: number;
  confirmationRate?: number;
  deliveryRate?: number;
  targetFactor?: number;
};

export type Economics = {
  codFee: number;
  /** Lo que queda si el pedido se entrega. */
  profitIfDelivered: number;
  /** Lo que se pierde si se devuelve (flete). */
  lossIfReturned: number;
  /** Ganancia esperada por cada pedido creado (antes de publicidad). */
  expectedPerOrder: number;
  /** Máximo a pagar en ads por pedido creado sin perder plata. */
  breakEvenCpa: number;
  /** CPA a buscar para ganar dinero. */
  targetCpa: number;
  /** Precio ÷ costo del proveedor. */
  markup: number;
  /** Salud del producto según el plan (precio ≥ 2.5× costo y CPA de equilibrio razonable). */
  health: "bueno" | "justo" | "malo";
};

const round2 = (n: number) => Math.round(n * 100) / 100;

export function computeEconomics(input: EconomicsInput): Economics {
  const {
    price,
    cost,
    shipping,
    codFeePercent = ECONOMICS_DEFAULTS.codFeePercent,
    confirmationRate = ECONOMICS_DEFAULTS.confirmationRate,
    deliveryRate = ECONOMICS_DEFAULTS.deliveryRate,
    targetFactor = ECONOMICS_DEFAULTS.targetFactor,
  } = input;

  const codFee = price * (codFeePercent / 100);
  const profitIfDelivered = price - cost - shipping - codFee;
  const lossIfReturned = shipping;
  const perDispatched = deliveryRate * profitIfDelivered - (1 - deliveryRate) * lossIfReturned;
  const expectedPerOrder = confirmationRate * perDispatched;
  const breakEvenCpa = Math.max(0, expectedPerOrder);
  const markup = cost > 0 ? price / cost : 0;

  let health: Economics["health"] = "malo";
  if (markup >= 2.5 && breakEvenCpa >= 20) health = "bueno";
  else if (markup >= 2 && breakEvenCpa >= 12) health = "justo";

  return {
    codFee: round2(codFee),
    profitIfDelivered: round2(profitIfDelivered),
    lossIfReturned: round2(lossIfReturned),
    expectedPerOrder: round2(expectedPerOrder),
    breakEvenCpa: round2(breakEvenCpa),
    targetCpa: round2(breakEvenCpa * targetFactor),
    markup: round2(markup),
    health,
  };
}
