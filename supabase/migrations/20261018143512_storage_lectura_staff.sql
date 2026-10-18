-- La API de Storage necesita permiso SELECT para listar y para borrar archivos.
-- Las URLs públicas del bucket siguen funcionando sin esta política.
create policy "productos: staff lista archivos" on storage.objects
  for select to authenticated
  using (bucket_id = 'productos' and (select public.is_staff()));
