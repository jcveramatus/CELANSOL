/** Enlace wa.me con mensaje opcional. `number` en formato 51XXXXXXXXX (Preferencias de la tienda). */
export function whatsappLink(number: string | null | undefined, message?: string) {
  const n = (number ?? "").replace(/\D/g, "");
  if (!/^51\d{9}$/.test(n)) return null;
  return message ? `https://wa.me/${n}?text=${encodeURIComponent(message)}` : `https://wa.me/${n}`;
}
