-- Private bucket for health/pedigree certificates (path convention: <user_id>/<pet_id>.jpg)
insert into storage.buckets (id, name, public)
values ('pet-certificates', 'pet-certificates', false)
on conflict (id) do nothing;

create policy "owner manages own certificates" on storage.objects
  for all to authenticated
  using      (bucket_id = 'pet-certificates' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'pet-certificates' and (storage.foldername(name))[1] = (select auth.uid())::text);
