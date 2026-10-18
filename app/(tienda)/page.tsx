import { InviteHashRedirect } from "@/components/auth/invite-hash-redirect";
import { Logo } from "@/components/marca/logo";
import { Badge } from "@/components/ui/badge";

// Home provisional. El home real se arma con el constructor de secciones (v0.4);
// en v0.1 el tráfico de ads entra directo a las landings de producto.
export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <InviteHashRedirect />
      <section className="bg-marca px-4 py-20 text-white sm:py-28">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <Logo tone="blanco" className="text-5xl sm:text-7xl" />
          <h1 className="text-2xl font-semibold sm:text-3xl">
            Soluciones inteligentes para tu hogar y tus mascotas
          </h1>
          <p className="max-w-xl text-white/90">
            Estamos preparando la tienda. Muy pronto: productos que te hacen la vida más fácil,
            con pago al recibir y envíos a todo el Perú.
          </p>
        </div>
      </section>

      <section className="px-4 py-12">
        <ul className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-3">
          {[
            ["Pagas al recibir", "Contra entrega en Lima y provincias"],
            ["Envíos a todo el Perú", "Seguimiento de tu pedido"],
            ["Hogar + Mascotas", "Tecnología útil para el día a día"],
          ].map(([title, text]) => (
            <li key={title} className="rounded-tarjeta border border-borde p-5">
              <Badge variant="envio">{title}</Badge>
              <p className="mt-2 text-sm text-tinta-suave">{text}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
