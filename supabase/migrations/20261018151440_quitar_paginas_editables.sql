-- El diseño de la tienda es fijo (lo define el código), así que se retira el
-- constructor de páginas. El Pixel de Meta se instala vía Google Tag Manager.

drop table public.store_pages;

drop policy "tienda: staff lista archivos" on storage.objects;
drop policy "tienda: staff sube archivos" on storage.objects;
drop policy "tienda: staff actualiza archivos" on storage.objects;
drop policy "tienda: staff borra archivos" on storage.objects;
-- El bucket "tienda" (vacío) se elimina con la API de Storage.

alter table public.store_settings drop column meta_pixel_id;
alter table public.store_settings
  add column gtm_container_id text
  check (gtm_container_id is null or gtm_container_id ~ '^GTM-[A-Z0-9]{4,12}$');
