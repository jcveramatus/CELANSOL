/**
 * Eventos de e-commerce al dataLayer de GTM (formato GA4). En GTM se mapean
 * a Meta Pixel / GA4 / TikTok. `event_id` permite deduplicar con la
 * Conversions API del servidor (se usa en `purchase`).
 */
type Item = { item_id: string; item_name: string; price: number; quantity: number; item_category?: string };

type EcommerceEvent = {
  event: "view_item" | "begin_checkout" | "add_payment_info" | "purchase";
  event_id?: string;
  ecommerce: { currency: "PEN"; value: number; transaction_id?: string; items: Item[] };
};

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function pushEcommerce(payload: EcommerceEvent) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  // GA4 recomienda limpiar el objeto ecommerce anterior.
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push(payload);
}
