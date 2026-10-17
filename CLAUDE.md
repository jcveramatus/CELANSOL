@AGENTS.md

# Celansol — reglas del proyecto

E-commerce propio de **Celansol** (Perú): artículos para el hogar con tecnología + mascotas.
Modelo: **dropshipping con Dropi Perú**, cobro **contra entrega (COD)** y luego pago online.
Plan maestro: `docs/PLAN-ECOMMERCE-CELANSOL.md` (fases, versiones v0.0→v0.5, tareas).

## Stack
- Next.js 16 (App Router, **Cache Components activado**, `proxy.ts` en vez de middleware). Antes de usar una API de Next, leer `node_modules/next/dist/docs/`.
- Supabase (Postgres + Auth + Storage). Migraciones en `supabase/migrations/`, siempre con RLS.
- Tailwind v4 (tokens en `app/globals.css` con `@theme`). Sin librería de componentes: `components/ui/`.
- Deploy: Vercel. Idioma de la UI: español de Perú. Moneda: PEN (`formatSoles`).

## Reglas que no se rompen
1. **Todo precio, descuento, oferta y envío se calcula en el servidor.** El navegador solo manda IDs y cantidades; nunca se confía en montos que vengan del cliente.
2. **Secret key de Supabase solo en el servidor** (`lib/supabase/admin.ts`, con `server-only`). Nada sensible en variables `NEXT_PUBLIC_*`.
3. **Dropi aislado en `lib/dropi/`** con dos modos (`DROPI_MODE=manual|api`). El resto del código no conoce detalles de Dropi.
4. Componentes que leen cookies o sesión van dentro de `<Suspense>` (Cache Components).
5. Mobile-first: ~90% del tráfico viene de anuncios en el celular. Botón de compra visible siempre.
6. Accesibilidad: el texto blanco solo va sobre `verde-accion` o más oscuro (ver contraste en `globals.css`).
7. Cada cambio de estado de un pedido se registra en `order_events` (quién, cuándo, motivo).

## Marca
- Colores: `verde-brillo #36C61E`, `verde #2E9E2A`, `verde-accion #23861F` (botones), `verde-profundo #2A7A35`, `oferta #F59E0B`, `tinta #1F2A24`. Degradado de marca: clase `bg-marca`.
- Tipografía: Poppins (títulos, `font-display`) + Inter (cuerpo, `font-sans`).
- Logo provisional en `components/marca/logo.tsx` hasta tener el SVG oficial.
- Vista de todo el sistema de diseño: `/sistema-diseno`.
- Dirección visual: tienda y colecciones limpias y "premium" (referencia flowersandsaints.com.au: blanco, fotos grandes sobre gris claro, tarjetas redondeadas, chips de subcolección, toggle "Ver en uso", "Completa tu kit"). Landings de producto con elementos de conversión estilo enkasa.pe (precio tachado, % OFF, descuento por volumen, escasez real, CTA contra entrega grande). Detalle en el plan, sección 1.

## Estados de pedido (COD)
`nuevo → por_confirmar → confirmado → enviado_dropi → guia_generada → en_transito → en_reparto → entregado`
Ramas: `novedad`, `devuelto`, `cancelado`. Online: `pendiente_pago → pagado → …`

## Forma de trabajar
- Una tarea chica por sesión. Primero plan corto, después código, después `npm run lint` y `npm run build`.
- Commits pequeños en español, una rama por funcionalidad.
- Textos de la tienda: claros, cortos y orientados a beneficio. Nada de promesas falsas (stock, reseñas, plazos).
