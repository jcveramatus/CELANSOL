# Celansol · Tienda online

Tienda propia de Celansol: hogar con tecnología + mascotas, dropshipping con Dropi Perú y pago contra entrega.
El plan completo está en [`docs/PLAN-ECOMMERCE-CELANSOL.md`](docs/PLAN-ECOMMERCE-CELANSOL.md).

## Requisitos
- Node.js 20 o superior
- Cuenta de Supabase (y opcionalmente Docker, para correr Supabase local)

## Primeros pasos
```bash
npm install
cp .env.example .env.local   # y completa las claves de Supabase
npm run dev
```
- Tienda: http://localhost:3000
- Sistema de diseño: http://localhost:3000/sistema-diseno

## Scripts
| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run lint` | Revisión de código |
| `npx supabase migration new <nombre>` | Nueva migración de base de datos |
| `npx supabase db push` | Aplica las migraciones al proyecto de Supabase vinculado |

## Estructura
```
app/(tienda)/      Tienda pública (home, landings de producto, gracias)
app/admin/         Panel de administración (desde la tarea 3)
app/sistema-diseno Vista interna de colores y componentes
components/ui/     Botones, badges, inputs, precios
components/marca/  Logo
lib/supabase/      Clientes de Supabase (navegador, servidor, admin)
supabase/          Configuración y migraciones
docs/              Plan y archivos de marca
```
