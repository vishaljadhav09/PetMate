-- Full postal addresses for pets and users.
--
-- PRIVACY: the street address and pincode are private. Public listings (`pets`, `profiles`) keep
-- only the city and the ~500 m snapped location. The full address lives in owner-only tables and
-- is geocoded on the client, so the snapped pet location matches the address that was entered.

-- ============ pet_addresses (owner + admin read; owner write) ============
create table public.pet_addresses (
  pet_id uuid primary key references public.pets(id) on delete cascade,
  address_line text not null check (char_length(address_line) between 3 and 200),
  state text not null check (char_length(state) between 2 and 60),
  pincode text not null check (pincode ~ '^[1-9][0-9]{5}$'),   -- Indian PIN code
  updated_at timestamptz not null default now()
);

create trigger pet_addresses_updated_at before update on public.pet_addresses
  for each row execute function public.set_updated_at();

alter table public.pet_addresses enable row level security;

grant select on public.pet_addresses to authenticated;
grant insert (pet_id, address_line, state, pincode) on public.pet_addresses to authenticated;
grant update (address_line, state, pincode) on public.pet_addresses to authenticated;

create policy "pet address read own" on public.pet_addresses
  for select to authenticated using (
    public.is_admin()
    or exists (select 1 from public.pets p
               where p.id = pet_addresses.pet_id and p.owner_id = (select auth.uid())));
create policy "pet address insert own" on public.pet_addresses
  for insert to authenticated with check (
    exists (select 1 from public.pets p
            where p.id = pet_addresses.pet_id and p.owner_id = (select auth.uid())));
create policy "pet address update own" on public.pet_addresses
  for update to authenticated
  using (exists (select 1 from public.pets p
                 where p.id = pet_addresses.pet_id and p.owner_id = (select auth.uid())))
  with check (exists (select 1 from public.pets p
                      where p.id = pet_addresses.pet_id and p.owner_id = (select auth.uid())));

-- ============ profile_private: the user's own address ============
-- lat/lng is where the address geocodes to. It is only readable by the user (own-row policy) and
-- gives Discover a default search origin when device location is off.
alter table public.profile_private
  add column address_line text check (char_length(address_line) <= 200),
  add column state text check (char_length(state) <= 60),
  add column pincode text check (pincode is null or pincode ~ '^[1-9][0-9]{5}$'),
  add column lat double precision check (lat is null or lat between -90 and 90),
  add column lng double precision check (lng is null or lng between -180 and 180);

grant update (address_line, state, pincode, lat, lng) on public.profile_private to authenticated;
