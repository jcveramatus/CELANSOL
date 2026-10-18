"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Inicio", exact: true },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/preferencias", label: "Preferencias" },
  { href: "/admin/pedidos", label: "Pedidos", soon: true },
  { href: "/admin/analitica", label: "Analítica", soon: true },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Panel">
      <ul className="flex gap-1 overflow-x-auto md:flex-col">
        {items.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          if (item.soon) {
            return (
              <li key={item.href}>
                <span className="flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm text-tinta-suave/70">
                  {item.label}
                  <span className="rounded bg-fondo-suave px-1.5 text-[10px] font-semibold uppercase">
                    Pronto
                  </span>
                </span>
              </li>
            );
          }
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "block whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active ? "bg-verde-suave text-verde-profundo" : "text-tinta hover:bg-fondo-suave",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
