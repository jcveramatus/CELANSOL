import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/marca/logo";
import { requireStaff } from "@/lib/auth";
import { signOut } from "../login/actions";
import { AdminNav } from "./admin-nav";

// Panel interno: depende de la sesión en cada request, puede bloquear.
export const instant = false;

export const metadata: Metadata = {
  title: { default: "Panel", template: "%s | Panel Celansol" },
  robots: { index: false, follow: false },
};

const roleLabel = {
  admin: "Administrador",
  operaciones: "Operaciones",
  contenido: "Contenido",
  atencion: "Atención",
} as const;

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const staff = await requireStaff();

  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-fondo-suave md:flex-row">
      <aside className="flex flex-col gap-6 border-b border-borde bg-white p-4 md:sticky md:top-0 md:h-dvh md:w-60 md:shrink-0 md:border-b-0 md:border-r">
        <div className="flex items-center justify-between md:flex-col md:items-start md:gap-1">
          <Link href="/admin" aria-label="Inicio del panel">
            <Logo className="text-2xl" />
          </Link>
          <span className="text-xs text-tinta-suave">Panel de administración</span>
        </div>
        <AdminNav />
        <div className="mt-auto hidden flex-col gap-2 border-t border-borde pt-4 text-sm md:flex">
          <span className="font-semibold">{staff.fullName}</span>
          <span className="text-xs text-tinta-suave">{roleLabel[staff.role]}</span>
          <form action={signOut}>
            <button type="submit" className="text-sm text-tinta-suave underline hover:text-tinta">
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
