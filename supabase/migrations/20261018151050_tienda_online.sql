-- =============================================================================
-- Celansol · "Tienda online": preferencias de la tienda y páginas editables
-- (constructor de secciones con borrador y versión publicada).
-- =============================================================================

-- Preferencias: una sola fila.
create table public.store_settings (
  id boolean primary key default true check (id),
  store_name text not null default 'Celansol',
  -- Formato internacional sin "+": 51 + 9 dígitos
  whatsapp_number text check (whatsapp_number is null or whatsapp_number ~ '^51[0-9]{9}$'),
  announcements text[] not null default array[
    'Pagas al recibir tu pedido',
    'Envíos a todo el Perú',
    'Te confirmamos tu pedido por WhatsApp'
  ],
  -- [{ "icon": "cash", "text": "Pagas al recibir" }]
  trust_badges jsonb not null default '[
    {"icon": "cash", "text": "Pagas al recibir"},
    {"icon": "truck", "text": "Envíos a todo el Perú"},
    {"icon": "chat", "text": "Confirmación por WhatsApp"},
    {"icon": "shield", "text": "Compra segura"}
  ]',
  footer_text text not null default 'Soluciones inteligentes para tu hogar y tus mascotas. Pagas al recibir y enviamos a todo el Perú.',
  seo_title text,
  seo_description text,
  meta_pixel_id text check (meta_pixel_id is null or meta_pixel_id ~ '^[0-9]{6,20}$'),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

insert into public.store_settings (id) values (true);

create trigger store_settings_updated_at before update on public.store_settings
  for each row execute function public.set_updated_at();

-- Páginas armadas con secciones. "draft" se edita en el editor; "published" es lo que ve el público.
create table public.store_pages (
  key text primary key check (key ~ '^[a-z0-9-]+$'),
  title text not null,
  -- [{ "id": "...", "type": "hero", "visible": true, "settings": {...} }]
  draft jsonb not null default '[]',
  published jsonb not null default '[]',
  draft_updated_at timestamptz,
  published_at timestamptz,
  published_by uuid references auth.users (id) on delete set null
);

insert into public.store_pages (key, title) values ('inicio', 'Inicio');

alter table public.store_settings enable row level security;
alter table public.store_pages enable row level security;

create policy "preferencias: público lee" on public.store_settings
  for select to anon, authenticated using (true);
create policy "preferencias: admin y contenido editan" on public.store_settings
  for update to authenticated
  using ((select public.is_staff(array['admin', 'contenido']::public.staff_role[])))
  with check ((select public.is_staff(array['admin', 'contenido']::public.staff_role[])));

create policy "páginas: público lee" on public.store_pages
  for select to anon, authenticated using (true);
create policy "páginas: admin y contenido editan" on public.store_pages
  for update to authenticated
  using ((select public.is_staff(array['admin', 'contenido']::public.staff_role[])))
  with check ((select public.is_staff(array['admin', 'contenido']::public.staff_role[])));

-- El público solo ve la versión publicada (el borrador queda oculto por columna).
revoke all on public.store_pages from anon;
grant select (key, title, published, published_at) on public.store_pages to anon;
grant select, update on public.store_pages to authenticated;

revoke all on public.store_settings from anon;
grant select on public.store_settings to anon;
grant select, update on public.store_settings to authenticated;

-- Imágenes de las secciones de la tienda (banners, categorías).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('tienda', 'tienda', true, 10485760, array['image/webp', 'image/jpeg', 'image/png', 'image/avif'])
on conflict (id) do nothing;

create policy "tienda: staff lista archivos" on storage.objects
  for select to authenticated
  using (bucket_id = 'tienda' and (select public.is_staff()));
create policy "tienda: staff sube archivos" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'tienda' and (select public.is_staff(array['admin', 'contenido']::public.staff_role[])));
create policy "tienda: staff actualiza archivos" on storage.objects
  for update to authenticated
  using (bucket_id = 'tienda' and (select public.is_staff(array['admin', 'contenido']::public.staff_role[])));
create policy "tienda: staff borra archivos" on storage.objects
  for delete to authenticated
  using (bucket_id = 'tienda' and (select public.is_staff(array['admin', 'contenido']::public.staff_role[])));
