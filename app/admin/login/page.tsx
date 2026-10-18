import type { Metadata } from "next";
import { Logo } from "@/components/marca/logo";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Ingresar al panel",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-fondo-suave px-4 py-16">
      <div className="w-full max-w-sm rounded-tarjeta border border-borde bg-white p-8 shadow-sm">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <Logo className="text-3xl" />
          <p className="text-sm text-tinta-suave">Panel de administración</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
