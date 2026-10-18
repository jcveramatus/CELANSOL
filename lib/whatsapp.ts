const PLACEHOLDER = "51900000000";

/** Número de WhatsApp de la tienda (formato 51XXXXXXXXX) o null si no está configurado. */
export function whatsappNumber() {
  const n = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");
  return n && n !== PLACEHOLDER ? n : null;
}

export function whatsappLink(message?: string) {
  const n = whatsappNumber();
  if (!n) return null;
  return message ? `https://wa.me/${n}?text=${encodeURIComponent(message)}` : `https://wa.me/${n}`;
}
