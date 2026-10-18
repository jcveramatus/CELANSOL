import type { Metadata } from "next";
import { Logo } from "@/components/marca/logo";
import { AcceptInvite } from "./accept-invite";

export const metadata: Metadata = {
  title: "Crea tu contraseña",
  robots: { index: false, follow: false },
};

export default function AcceptInvitePage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-fondo-suave px-4 py-16">
      <div className="w-full max-w-sm rounded-tarjeta border border-borde bg-white p-8 shadow-sm">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <Logo className="text-3xl" />
          <h1 className="text-lg font-semibold">Bienvenido al panel</h1>
          <p className="text-sm text-tinta-suave">Crea tu contraseña para ingresar.</p>
        </div>
        <AcceptInvite />
      </div>
    </main>
  );
}
