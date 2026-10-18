import { Logo } from "@/components/marca/logo";

export function StoreFooter() {
  return (
    <footer className="mt-auto bg-verde-profundo px-4 pb-28 pt-10 text-white md:pb-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-3">
        <Logo tone="blanco" className="text-2xl" />
        <p className="max-w-md text-sm text-white/85">
          Soluciones inteligentes para tu hogar y tus mascotas. Pagas al recibir y enviamos a todo
          el Perú.
        </p>
        <p className="text-xs text-white/70">© Celansol</p>
      </div>
    </footer>
  );
}
