import { z } from "zod";

/** Íconos disponibles para sellos de confianza y beneficios de la tienda. */
export const STORE_ICONS = {
  cash: "Billete (pago)",
  truck: "Camión (envío)",
  chat: "Chat (WhatsApp)",
  shield: "Escudo (seguridad)",
  star: "Estrella (calidad)",
  box: "Caja (producto)",
  heart: "Corazón (cuidado)",
  paw: "Huella (mascotas)",
  home: "Casa (hogar)",
  bolt: "Rayo (tecnología)",
} as const;

export type StoreIcon = keyof typeof STORE_ICONS;
export const storeIcon = z.enum(Object.keys(STORE_ICONS) as [StoreIcon, ...StoreIcon[]]);

export const trustBadgeSchema = z.object({ icon: storeIcon, text: z.string().trim().min(1).max(40) });
export type TrustBadge = z.infer<typeof trustBadgeSchema>;

export type StoreSettings = {
  storeName: string;
  whatsappNumber: string | null;
  announcements: string[];
  trustBadges: TrustBadge[];
  footerText: string;
  seoTitle: string | null;
  seoDescription: string | null;
  gtmContainerId: string | null;
};

export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: "Celansol",
  whatsappNumber: null,
  announcements: ["Pagas al recibir tu pedido", "Envíos a todo el Perú"],
  trustBadges: [
    { icon: "cash", text: "Pagas al recibir" },
    { icon: "truck", text: "Envíos a todo el Perú" },
  ],
  footerText: "Soluciones inteligentes para tu hogar y tus mascotas.",
  seoTitle: null,
  seoDescription: null,
  gtmContainerId: null,
};
