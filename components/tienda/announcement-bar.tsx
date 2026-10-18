"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Pagas al recibir tu pedido",
  "Envíos a todo el Perú",
  "Te confirmamos tu pedido por WhatsApp",
];

/** Barra superior con mensajes que rotan cada 4 s (pausa si el usuario prefiere menos movimiento). */
export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % MESSAGES.length), 4000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="bg-verde-profundo px-4 py-2 text-center text-xs font-semibold text-white sm:text-sm">
      <p aria-live="off">{MESSAGES[index]}</p>
    </div>
  );
}
