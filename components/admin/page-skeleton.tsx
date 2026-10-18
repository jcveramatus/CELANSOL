/** Esqueleto de carga del panel (se muestra al instante mientras llegan los datos). */
export function PageSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div aria-busy="true" aria-live="polite" className="animate-pulse">
      <span className="sr-only">Cargando…</span>
      <div className="flex items-end justify-between gap-4 border-b border-borde bg-white px-4 py-5 md:px-8">
        <div className="flex flex-col gap-2">
          <div className="h-7 w-48 rounded-lg bg-fondo-suave" />
          <div className="h-4 w-72 max-w-full rounded bg-fondo-suave" />
        </div>
        <div className="h-11 w-36 rounded-xl bg-fondo-suave" />
      </div>
      <div className="flex flex-col gap-3 p-4 md:p-8">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="h-16 rounded-tarjeta border border-borde bg-white" />
        ))}
      </div>
    </div>
  );
}
