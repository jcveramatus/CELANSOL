import type { Metadata } from "next";
import { Logo } from "@/components/marca/logo";
import { Button } from "@/components/ui/button";
import { signOut } from "../login/actions";

export const metadata: Metadata = {
  title: "Sin acceso",
  robots: { index: false, follow: false },
};

export default function NoAccessPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-fondo-suave px-4 py-16">
      <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-tarjeta border border-borde bg-white p-8 text-center shadow-sm">
        <Logo className="text-3xl" />
        <h1 className="text-lg font-semibold">Tu cuenta no tiene acceso al panel</h1>
        <p className="text-sm text-tinta-suave">
          Pide a un administrador que te agregue al equipo.
        </p>
        <form action={signOut} className="w-full">
          <Button type="submit" variant="secondary" fullWidth>
            Cerrar sesión
          </Button>
        </form>
      </div>
    </main>
  );
}
