"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { LandingMedia } from "@/lib/products/landing";
import { cn } from "@/lib/utils";

/**
 * Galería con deslizamiento (scroll-snap) y miniaturas.
 * Si hay fotos "en uso", aparece el interruptor "Ver en uso" (idea tomada de F&S "Show on model").
 */
export function ProductGallery({ media, title }: { media: LandingMedia[]; title: string }) {
  const productMedia = media.filter((m) => m.context === "producto");
  const inUseMedia = media.filter((m) => m.context === "en_uso");
  const [showInUse, setShowInUse] = useState(false);
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const items = showInUse && inUseMedia.length ? inUseMedia : productMedia.length ? productMedia : inUseMedia;

  function goTo(index: number) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: index * track.clientWidth, behavior: "smooth" });
  }

  function toggle(next: boolean) {
    setShowInUse(next);
    setActive(0);
    trackRef.current?.scrollTo({ left: 0 });
  }

  if (items.length === 0) {
    return <div className="aspect-square w-full rounded-tarjeta bg-fondo-suave" aria-hidden="true" />;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <div
          ref={trackRef}
          onScroll={(e) => {
            const el = e.currentTarget;
            setActive(Math.round(el.scrollLeft / el.clientWidth));
          }}
          className="flex aspect-square snap-x snap-mandatory overflow-x-auto rounded-tarjeta bg-fondo-suave [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-roledescription="carrusel"
          aria-label={`Fotos de ${title}`}
        >
          {items.map((m, i) => (
            <div
              key={m.id}
              className="relative aspect-square w-full shrink-0 snap-center"
              aria-roledescription="diapositiva"
              aria-label={`${i + 1} de ${items.length}`}
            >
              {m.type === "video" ? (
                <video
                  src={m.url}
                  className="size-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-label={m.alt || title}
                />
              ) : (
                <Image
                  src={m.url}
                  alt={m.alt || `${title}, foto ${i + 1}`}
                  fill
                  sizes="(min-width: 1024px) 560px, 100vw"
                  className="object-cover"
                  preload={i === 0}
                  quality={85}
                />
              )}
            </div>
          ))}
        </div>

        {inUseMedia.length > 0 && productMedia.length > 0 && (
          <div className="absolute bottom-3 right-3">
            <button
              type="button"
              role="switch"
              aria-checked={showInUse}
              onClick={() => toggle(!showInUse)}
              className="flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-tinta shadow-sm backdrop-blur"
            >
              <span
                className={cn(
                  "relative h-4 w-7 rounded-full transition-colors",
                  showInUse ? "bg-verde-accion" : "bg-borde",
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 size-3 rounded-full bg-white transition-transform",
                    showInUse ? "translate-x-3.5" : "translate-x-0.5",
                  )}
                />
              </span>
              Ver en uso
            </button>
          </div>
        )}

        {items.length > 1 && (
          <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5 md:hidden">
            {items.map((m, i) => (
              <span
                key={m.id}
                className={cn("size-1.5 rounded-full", i === active ? "bg-tinta" : "bg-tinta/25")}
              />
            ))}
          </div>
        )}
      </div>

      {items.length > 1 && (
        <div className="hidden gap-2 md:flex">
          {items.map((m, i) => (
            <button
              key={m.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ver foto ${i + 1}`}
              aria-current={i === active}
              className={cn(
                "relative size-16 overflow-hidden rounded-xl border-2 bg-fondo-suave",
                i === active ? "border-verde-accion" : "border-transparent",
              )}
            >
              {m.type === "video" ? (
                <span className="flex size-full items-center justify-center text-xs">▶</span>
              ) : (
                <Image src={m.url} alt="" fill sizes="64px" className="object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
