"use client";

import { useEffect, useState } from "react";

/** Barra superior con mensajes que rotan cada 4 s (pausa si el usuario prefiere menos movimiento). */
export function AnnouncementBar({ messages }: { messages: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (messages.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % messages.length), 4000);
    return () => window.clearInterval(id);
  }, [messages.length]);

  if (messages.length === 0) return null;

  return (
    <div className="bg-verde-profundo px-4 py-2 text-center text-xs font-semibold text-white sm:text-sm">
      <p aria-live="off">{messages[index % messages.length]}</p>
    </div>
  );
}
