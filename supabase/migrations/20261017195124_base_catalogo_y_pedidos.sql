-- =============================================================================
-- Celansol · Tarea 2: esquema base de catálogo, clientes y pedidos
-- Reglas:
--  - RLS activado en todas las tablas.
--  - El catálogo activo es público (solo lectura). Costos y datos de Dropi: solo staff.
--  - Clientes y pedidos: solo staff. La tienda crea pedidos desde el servidor
--    con la secret key (se salta RLS), nunca desde el navegador.
--  - Cada cambio de estado de un pedido queda en order_events.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Tipos
-- -----------------------------------------------------------------------------
create type public.staff_role as enum ('admin', 'operaciones', 'contenido', 'atencion');

create type public.product_status as enum ('borrador', 'activo', 'archivado');
create type public.product_line as enum ('hogar', 'mascotas');
create type public.test_status as enum ('sin_testear', 'en_test', 'ganador', 'pausado', 'descartado');

create type public.media_type as enum ('imagen', 'video');
-- 'en_uso' alimenta el toggle "Ver en uso" de las colecciones.
create type public.media_context as enum ('producto', 'en_uso');

create type public.order_status as enum (
  'nuevo', 'por_confirmar', 'confirmado', 'enviado_dropi', 'guia_generada',
  'en_transito', 'en_reparto', 'entregado', 'novedad', 'devuelto', 'cancelado',
  'pendiente_pago', 'pagado'
);
create type public.payment_method as enum ('contra_entrega', 'online');
create type public.payment_status as enum ('pendiente', 'pagado', 'fallido', 'reembolsado');
create type public.order_actor as enum ('sistema', 'staff', 'cliente', 'dropi');
create type public.item_source as enum (
  'principal', 'volumen', 'upsell_formulario', 'post_compra', 'downsell', 'cross_sell'
);

-- -----------------------------------------------------------------------------
-- Utilidades
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- Staff (usuarios del panel admin)
-- -----------------------------------------------------------------------------
create table public.staff (
  user_id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  role public.staff_role not null default 'atencion',
  created_at timestamptz not null default now()
);

-- security definer: se usa dentro de políticas RLS sin recursión.
create or replace function public.staff_role()
returns public.staff_role
language sql
stable
security definer
set search_path = ''
as $$
  select role from public.staff where user_id = (select auth.uid());
$$;

create or replace function public.is_staff(allowed public.staff_role[] default null)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.staff s
    where s.user_id = (select auth.uid())
      and (allowed is null or s.role = any (allowed))
  );
$$;

-- -----------------------------------------------------------------------------
-- Catálogo
-- -----------------------------------------------------------------------------
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  subtitle text,
  description text,
  line public.product_line not null default 'hogar',
  product_type text,
  tags text[] not null default '{}',
  badges text[] not null default '{}',
  -- [{ "name": "Color", "values": ["Gris", "Blanco"] }]
  options jsonb not null default '[]',
  -- [{ "label": "Capacidad", "value": "2.5 L" }]
  specs jsonb not null default '[]',
  status public.product_status not null default 'borrador',
  test_status public.test_status not null default 'sin_testear',
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_status_idx on public.products (status);
create index products_line_idx on public.products (line) where status = 'activo';
create index products_tags_idx on public.products using gin (tags);

create trigger products_updated_at before update on public.products
  for each row execute function public.set_updated_at();

create table public.product_media (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  type public.media_type not null default 'imagen',
  context public.media_context not null default 'producto',
  -- Ruta dentro del bucket "productos" de Storage, o URL externa.
  storage_path text,
  url text,
  alt text not null default '',
  width int,
  height int,
  position int not null default 0,
  created_at timestamptz not null default now(),
  constraint product_media_source check (storage_path is not null or url is not null)
);

create index product_media_product_idx on public.product_media (product_id, context, position);

-- Shopify: todo producto tiene al menos una variante; el precio vive aquí.
create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  title text not null default 'Único',
  sku text unique,
  -- { "Color": "Gris" }
  option_values jsonb not null default '{}',
  price numeric(10, 2) not null check (price >= 0),
  compare_at_price numeric(10, 2) check (compare_at_price is null or compare_at_price >= 0),
  -- null = no se controla stock (lo controla Dropi)
  stock int check (stock is null or stock >= 0),
  image_id uuid references public.product_media (id) on delete set null,
  is_active boolean not null default true,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index product_variants_product_idx on public.product_variants (product_id, position);

create trigger product_variants_updated_at before update on public.product_variants
  for each row execute function public.set_updated_at();

-- Bloques de la landing de producto (beneficios, comparación, FAQ, etc.).
create table public.product_blocks (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  type text not null,
  data jsonb not null default '{}',
  position int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index product_blocks_product_idx on public.product_blocks (product_id, position);

create trigger product_blocks_updated_at before update on public.product_blocks
  for each row execute function public.set_updated_at();

-- Datos privados de abastecimiento y costos (NUNCA públicos).
create table public.dropi_links (
  variant_id uuid primary key references public.product_variants (id) on delete cascade,
  dropi_product_id text,
  dropi_variation_id text,
  supplier_name text,
  cost_price numeric(10, 2) not null default 0 check (cost_price >= 0),
  shipping_estimate numeric(10, 2) not null default 0 check (shipping_estimate >= 0),
  dropi_stock int,
  last_synced_at timestamptz,
  notes text,
  updated_at timestamptz not null default now()
);

create index dropi_links_dropi_product_idx on public.dropi_links (dropi_product_id);

create trigger dropi_links_updated_at before update on public.dropi_links
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Clientes
-- -----------------------------------------------------------------------------
create table public.customers (
  id uuid primary key default gen_random_uuid(),
  phone text not null unique check (phone ~ '^9[0-9]{8}$'),
  full_name text not null,
  email text,
  dni text check (dni is null or dni ~ '^[0-9]{8}$'),
  tags text[] not null default '{}',
  -- Lista negra COD
  is_blocked boolean not null default false,
  blocked_reason text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger customers_updated_at before update on public.customers
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Pedidos
-- -----------------------------------------------------------------------------
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigint generated always as identity (start with 1001) unique,
  customer_id uuid references public.customers (id) on delete set null,
  status public.order_status not null default 'nuevo',
  payment_method public.payment_method not null default 'contra_entrega',
  payment_status public.payment_status not null default 'pendiente',

  -- Copia de los datos del cliente al momento de comprar
  customer_name text not null,
  phone text not null check (phone ~ '^9[0-9]{8}$'),
  email text,
  dni text,

  -- Envío (Ubigeo INEI de 6 dígitos)
  ubigeo char(6) check (ubigeo ~ '^[0-9]{6}$'),
  department text not null,
  province text not null,
  district text not null,
  address_line text not null,
  address_reference text,

  -- Montos (calculados SIEMPRE en el servidor)
  subtotal numeric(10, 2) not null check (subtotal >= 0),
  discount_total numeric(10, 2) not null default 0 check (discount_total >= 0),
  shipping_total numeric(10, 2) not null default 0 check (shipping_total >= 0),
  total numeric(10, 2) not null check (total >= 0),
  currency char(3) not null default 'PEN',

  -- Atribución (dashboard y Meta CAPI)
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  fbclid text,
  fbp text,
  fbc text,
  landing_path text,
  client_ip inet,
  user_agent text,
  -- event_id compartido entre Pixel y CAPI para deduplicar Purchase
  tracking_event_id uuid not null default gen_random_uuid(),

  -- Dropi
  dropi_order_id text unique,
  tracking_number text,
  carrier text,
  dropi_status_raw text,
  dropi_synced_at timestamptz,

  -- Hitos
  confirmed_at timestamptz,
  sent_to_dropi_at timestamptz,
  delivered_at timestamptz,
  returned_at timestamptz,
  cancelled_at timestamptz,

  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint orders_total_ok check (total = subtotal - discount_total + shipping_total)
);

create index orders_created_at_idx on public.orders (created_at desc);
create index orders_status_idx on public.orders (status, created_at desc);
create index orders_phone_idx on public.orders (phone);
create index orders_customer_idx on public.orders (customer_id);

create trigger orders_updated_at before update on public.orders
  for each row execute function public.set_updated_at();

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  variant_id uuid references public.product_variants (id) on delete set null,
  -- Copias para que el pedido no cambie si se edita el producto
  title text not null,
  variant_title text,
  sku text,
  quantity int not null check (quantity > 0),
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  compare_at_price numeric(10, 2),
  unit_cost numeric(10, 2),
  discount_amount numeric(10, 2) not null default 0 check (discount_amount >= 0),
  line_total numeric(10, 2) not null check (line_total >= 0),
  source public.item_source not null default 'principal',
  created_at timestamptz not null default now()
);

create index order_items_order_idx on public.order_items (order_id);
create index order_items_product_idx on public.order_items (product_id);

create table public.order_events (
  id bigint generated always as identity primary key,
  order_id uuid not null references public.orders (id) on delete cascade,
  from_status public.order_status,
  to_status public.order_status not null,
  reason text,
  note text,
  actor public.order_actor not null default 'sistema',
  actor_user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index order_events_order_idx on public.order_events (order_id, created_at);

-- Hitos automáticos al cambiar de estado.
create or replace function public.orders_set_milestones()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status is distinct from old.status then
    case new.status
      when 'confirmado' then new.confirmed_at = coalesce(new.confirmed_at, now());
      when 'enviado_dropi' then new.sent_to_dropi_at = coalesce(new.sent_to_dropi_at, now());
      when 'entregado' then new.delivered_at = coalesce(new.delivered_at, now());
      when 'devuelto' then new.returned_at = coalesce(new.returned_at, now());
      when 'cancelado' then new.cancelled_at = coalesce(new.cancelled_at, now());
      else null;
    end case;
  end if;
  return new;
end;
$$;

create trigger orders_milestones before update of status on public.orders
  for each row execute function public.orders_set_milestones();

-- Registro automático en order_events. El motivo y el actor llegan por
-- set_config('celansol.status_reason' / 'celansol.status_actor', ..., true),
-- que setea change_order_status() (o el servidor antes de actualizar).
create or replace function public.orders_log_status()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor public.order_actor :=
    coalesce(nullif(current_setting('celansol.status_actor', true), ''), 'sistema')::public.order_actor;
begin
  if tg_op = 'INSERT' then
    insert into public.order_events (order_id, from_status, to_status, actor, actor_user_id, reason)
    values (new.id, null, new.status, v_actor, (select auth.uid()), 'Pedido creado');
  elsif new.status is distinct from old.status then
    insert into public.order_events (order_id, from_status, to_status, actor, actor_user_id, reason, note)
    values (
      new.id, old.status, new.status,
      case when (select auth.uid()) is not null then 'staff'::public.order_actor else v_actor end,
      (select auth.uid()),
      nullif(current_setting('celansol.status_reason', true), ''),
      nullif(current_setting('celansol.status_note', true), '')
    );
  end if;
  return null;
end;
$$;

create trigger orders_log_insert after insert on public.orders
  for each row execute function public.orders_log_status();
create trigger orders_log_update after update of status on public.orders
  for each row execute function public.orders_log_status();

-- Cambio de estado desde el panel (respeta RLS: security invoker).
-- Estados de "fallo" exigen motivo.
create or replace function public.change_order_status(
  p_order_id uuid,
  p_status public.order_status,
  p_reason text default null,
  p_note text default null
)
returns public.orders
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_order public.orders;
begin
  if p_status in ('cancelado', 'devuelto', 'novedad') and coalesce(trim(p_reason), '') = '' then
    raise exception 'El estado % requiere un motivo', p_status using errcode = '22023';
  end if;

  perform set_config('celansol.status_reason', coalesce(p_reason, ''), true);
  perform set_config('celansol.status_note', coalesce(p_note, ''), true);

  update public.orders set status = p_status where id = p_order_id
  returning * into v_order;

  if v_order.id is null then
    raise exception 'Pedido no encontrado o sin permiso' using errcode = 'P0002';
  end if;

  return v_order;
end;
$$;

-- Estadísticas por cliente (para detectar rechazos COD).
create view public.customer_stats
with (security_invoker = true)
as
select
  c.id as customer_id,
  count(o.id) as orders_count,
  count(o.id) filter (where o.status = 'entregado') as delivered_count,
  count(o.id) filter (where o.status = 'devuelto') as returned_count,
  count(o.id) filter (where o.status = 'cancelado') as cancelled_count,
  coalesce(sum(o.total) filter (where o.status = 'entregado'), 0) as delivered_revenue,
  max(o.created_at) as last_order_at
from public.customers c
left join public.orders o on o.customer_id = c.id
group by c.id;

-- -----------------------------------------------------------------------------
-- RLS
-- -----------------------------------------------------------------------------
alter table public.staff enable row level security;
alter table public.products enable row level security;
alter table public.product_media enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_blocks enable row level security;
alter table public.dropi_links enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_events enable row level security;

-- Staff
create policy "staff: cada uno ve su fila, admin ve todas" on public.staff
  for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_staff(array['admin']::public.staff_role[])));
create policy "staff: solo admin gestiona" on public.staff
  for all to authenticated
  using ((select public.is_staff(array['admin']::public.staff_role[])))
  with check ((select public.is_staff(array['admin']::public.staff_role[])));

-- Catálogo: lectura pública de lo activo; el staff ve todo.
create policy "productos: público ve activos" on public.products
  for select to anon, authenticated
  using (status = 'activo' or (select public.is_staff()));
create policy "productos: admin y contenido editan" on public.products
  for all to authenticated
  using ((select public.is_staff(array['admin', 'contenido']::public.staff_role[])))
  with check ((select public.is_staff(array['admin', 'contenido']::public.staff_role[])));

create policy "media: público ve la de productos activos" on public.product_media
  for select to anon, authenticated
  using (
    exists (select 1 from public.products p where p.id = product_id and p.status = 'activo')
    or (select public.is_staff())
  );
create policy "media: admin y contenido editan" on public.product_media
  for all to authenticated
  using ((select public.is_staff(array['admin', 'contenido']::public.staff_role[])))
  with check ((select public.is_staff(array['admin', 'contenido']::public.staff_role[])));

create policy "variantes: público ve las de productos activos" on public.product_variants
  for select to anon, authenticated
  using (
    (is_active and exists (select 1 from public.products p where p.id = product_id and p.status = 'activo'))
    or (select public.is_staff())
  );
create policy "variantes: admin y contenido editan" on public.product_variants
  for all to authenticated
  using ((select public.is_staff(array['admin', 'contenido']::public.staff_role[])))
  with check ((select public.is_staff(array['admin', 'contenido']::public.staff_role[])));

create policy "bloques: público ve los visibles de productos activos" on public.product_blocks
  for select to anon, authenticated
  using (
    (is_visible and exists (select 1 from public.products p where p.id = product_id and p.status = 'activo'))
    or (select public.is_staff())
  );
create policy "bloques: admin y contenido editan" on public.product_blocks
  for all to authenticated
  using ((select public.is_staff(array['admin', 'contenido']::public.staff_role[])))
  with check ((select public.is_staff(array['admin', 'contenido']::public.staff_role[])));

-- Costos y Dropi: solo staff.
create policy "dropi: staff lee" on public.dropi_links
  for select to authenticated using ((select public.is_staff()));
create policy "dropi: admin y contenido editan" on public.dropi_links
  for all to authenticated
  using ((select public.is_staff(array['admin', 'contenido']::public.staff_role[])))
  with check ((select public.is_staff(array['admin', 'contenido']::public.staff_role[])));

-- Clientes y pedidos: solo staff. Crear pedidos lo hace el servidor (secret key).
create policy "clientes: staff lee" on public.customers
  for select to authenticated using ((select public.is_staff()));
create policy "clientes: staff de operación edita" on public.customers
  for update to authenticated
  using ((select public.is_staff(array['admin', 'operaciones', 'atencion']::public.staff_role[])))
  with check ((select public.is_staff(array['admin', 'operaciones', 'atencion']::public.staff_role[])));

create policy "pedidos: staff lee" on public.orders
  for select to authenticated using ((select public.is_staff()));
create policy "pedidos: staff de operación edita" on public.orders
  for update to authenticated
  using ((select public.is_staff(array['admin', 'operaciones', 'atencion']::public.staff_role[])))
  with check ((select public.is_staff(array['admin', 'operaciones', 'atencion']::public.staff_role[])));

create policy "items: staff lee" on public.order_items
  for select to authenticated using ((select public.is_staff()));
create policy "items: admin y operaciones editan" on public.order_items
  for all to authenticated
  using ((select public.is_staff(array['admin', 'operaciones']::public.staff_role[])))
  with check ((select public.is_staff(array['admin', 'operaciones']::public.staff_role[])));

-- El historial solo se escribe por trigger: el staff solo lee.
create policy "eventos: staff lee" on public.order_events
  for select to authenticated using ((select public.is_staff()));

-- -----------------------------------------------------------------------------
-- Permisos de la API (defensa en profundidad además de RLS)
-- -----------------------------------------------------------------------------
revoke all on public.staff, public.dropi_links, public.customers, public.orders,
  public.order_items, public.order_events, public.customer_stats from anon;

grant select on public.products, public.product_media, public.product_variants,
  public.product_blocks to anon;
grant select, insert, update, delete on public.products, public.product_media,
  public.product_variants, public.product_blocks, public.dropi_links, public.staff,
  public.customers, public.orders, public.order_items to authenticated;
grant select on public.order_events, public.customer_stats to authenticated;

revoke execute on function public.change_order_status(uuid, public.order_status, text, text) from anon, public;
grant execute on function public.change_order_status(uuid, public.order_status, text, text) to authenticated;
revoke execute on function public.staff_role() from anon, public;
grant execute on function public.staff_role() to authenticated;
grant execute on function public.is_staff(public.staff_role[]) to anon, authenticated;

-- -----------------------------------------------------------------------------
-- Storage: imágenes y videos de productos (lectura pública, escritura staff)
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'productos', 'productos', true, 52428800,
  array['image/webp', 'image/jpeg', 'image/png', 'image/avif', 'video/mp4', 'video/webm']
)
on conflict (id) do nothing;

create policy "productos: staff sube archivos" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'productos' and (select public.is_staff(array['admin', 'contenido']::public.staff_role[])));
create policy "productos: staff actualiza archivos" on storage.objects
  for update to authenticated
  using (bucket_id = 'productos' and (select public.is_staff(array['admin', 'contenido']::public.staff_role[])));
create policy "productos: staff borra archivos" on storage.objects
  for delete to authenticated
  using (bucket_id = 'productos' and (select public.is_staff(array['admin', 'contenido']::public.staff_role[])));
