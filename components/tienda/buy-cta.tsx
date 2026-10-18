"use client";

import { useEffect, useState } from "react";
import { cn, formatSoles } from "@/lib/utils";
import { IconWhatsApp } from "./icons";

/**
 * Botón principal de compra. Hasta que exista el formulario contra entrega
 * (tarea 5), abre WhatsApp con el pedido prellenado (estrategia v0.0).
 */
export function BuyCta({
  href,
  price,
  className,
  id,
}: {
  href: string | null;
  price: number;
  className?: string;
  id?: string;
}) {
  if (!href) {
    return (
      <p className={cn("rounded-xl bg-fondo-suave px-4 py-3 text-center text-sm text-tinta-suave", className)}>
        Muy pronto podrás pedir este producto aquí.
      </p>
    );
  }
  return (
    <a
      id={id}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex min-h-14 w-full flex-col items-center justify-center rounded-xl bg-verde-accion px-6 py-2 text-center font-bold text-white transition-colors hover:bg-verde-accion-hover",
        className,
      )}
    >
      <span className="flex items-center gap-2 text-lg">
        <IconWhatsApp className="size-5" />
        Pedir ahora · {formatSoles(price)}
      </span>
      <span className="text-xs font-medium text-white/90">Pagas al recibir</span>
    </a>
  );
}

/** Barra fija inferior en el móvil: aparece cuando el botón principal sale de la pantalla. */
export function StickyBuyBar({
  targetId,
  href,
  price,
  title,
}: {
  targetId: string;
  href: string | null;
  price: number;
  title: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0),
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [targetId]);

  if (!href) return null;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-borde bg-white/95 p-3 backdrop-blur transition-transform duration-200 md:hidden",
        visible ? "translate-y-0" : "translate-y-full",
      )}
      aria-hidden={!visible}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-tinta-suave">{title}</p>
          <p className="font-display text-lg font-bold">{formatSoles(price)}</p>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={visible ? 0 : -1}
          className="flex h-12 items-center gap-2 rounded-xl bg-verde-accion px-5 font-bold text-white"
        >
          <IconWhatsApp className="size-5" />
          Pedir ahora
        </a>
      </div>
    </div>
  );
}
