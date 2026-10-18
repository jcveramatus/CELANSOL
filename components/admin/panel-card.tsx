import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PanelCard({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("flex flex-col gap-4 rounded-tarjeta border border-borde bg-white p-5", className)}>
      <div>
        <h2 className="text-base font-semibold">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-tinta-suave">{description}</p>}
      </div>
      {children}
    </section>
  );
}
