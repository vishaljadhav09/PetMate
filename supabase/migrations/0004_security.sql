-- ============ turn on RLS everywhere ============
alter table public.admins              enable row level security;   -- no policies = nobody but dashboard
alter table public.app_settings        enable row level security;
alter table public.breeding_age_rules  enable row level security;
alter table public.breed_age_overrides enable row level security;
alter table public.profiles            enable row level security;
alter table public.profile_private     enable row level security;
alter table public.pets                enable row level security;
alter table public.match_requests      enable row level security;
alter table public.ratings             enable row level security;
alter table public.reports             enable row level security;
alter table public.favorites           enable row level security;

-- ============ start from zero privileges, then grant explicitly ============
revoke all on all tables in schema public from anon, authenticated;

-- config tables: readable by everyone (also lets the keep-alive ping work without login)
grant select on public.breeding_age_rules, public.breed_age_overrides to anon, authenticated;
-- the app may read the flag (to decide whether to show 'pending approval' messages); only you can change it
grant select on public.app_settings to authenticated;

-- profiles: everyone signed-in can read; users edit only harmless columns
grant select on public.profiles to authenticated;
grant update (name, avatar_url, city, bio, last_active) on public.profiles to authenticated;

-- private info: own row only
grant select on public.profile_private to authenticated;
grant update (phone, push_token) on public.profile_private to authenticated;

-- pets: owners write listing data; verified/approved/hidden/lat/lng are NOT writable
grant select, delete on public.pets to authenticated;
grant insert (owner_id, pet_name, species, breed, gender, date_of_birth, photos, description,
              pedigree_certified, registration_number, vaccination_up_to_date, last_vet_checkup,
              hip_score, certificate_url, litter_ref, owner_attests_breeding_ready,
              breeding_status, stud_fee_type, stud_fee, location, city, status)
  on public.pets to authenticated;
grant update (pet_name, species, breed, gender, date_of_birth, photos, description,
              pedigree_certified, registration_number, vaccination_up_to_date, last_vet_checkup,
              hip_score, certificate_url, litter_ref, owner_attests_breeding_ready,
              breeding_status, stud_fee_type, stud_fee, location, city, status)
  on public.pets to authenticated;

-- match requests: read own; create via insert (trigger validates); status changes go through RPC only
grant select on public.match_requests to authenticated;
grant insert (sender_pet_id, pet_id, message, proposed_date) on public.match_requests to authenticated;

-- ratings, reports, favorites
grant select on public.ratings to authenticated;
grant insert (match_request_id, rating, comment) on public.ratings to authenticated;
grant select on public.reports to authenticated;
grant insert (reported_pet_id, reported_user_id, reason, details) on public.reports to authenticated;
grant select, delete on public.favorites to authenticated;
grant insert (pet_id) on public.favorites to authenticated;

-- ============ policies ============
-- config
create policy "read rules" on public.breeding_age_rules  for select to anon, authenticated using (true);
create policy "read overrides" on public.breed_age_overrides for select to anon, authenticated using (true);
create policy "read settings" on public.app_settings for select to authenticated using (true);

-- profiles
create policy "profiles readable" on public.profiles
  for select to authenticated using (true);
create policy "profiles update own" on public.profiles
  for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- profile_private
create policy "private read own" on public.profile_private
  for select to authenticated using (id = (select auth.uid()));
create policy "private update own" on public.profile_private
  for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- pets
create policy "pets read" on public.pets
  for select to authenticated using (
    (status = 'active' and approved and not hidden)               -- public listings
    or owner_id = (select auth.uid())                              -- my own, any state
    or public.is_admin()
    or exists (                                                    -- pets in my requests (inbox/sent)
      select 1 from public.match_requests m
      where (m.pet_id = pets.id or m.sender_pet_id = pets.id)
        and (m.sender_id = (select auth.uid()) or m.recipient_id = (select auth.uid())))
  );
create policy "pets insert own" on public.pets
  for insert to authenticated with check (owner_id = (select auth.uid()));
create policy "pets update own" on public.pets
  for update to authenticated
  using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy "pets delete own" on public.pets
  for delete to authenticated using (owner_id = (select auth.uid()));

-- match_requests (no update/delete policies: changes only via set_match_request_status)
create policy "requests read participants" on public.match_requests
  for select to authenticated using (
    sender_id = (select auth.uid()) or recipient_id = (select auth.uid()));
create policy "requests insert as self" on public.match_requests
  for insert to authenticated with check (sender_id = (select auth.uid()));

-- ratings (public reputation; insert validated by trigger)
create policy "ratings readable" on public.ratings for select to authenticated using (true);
create policy "ratings insert as self" on public.ratings
  for insert to authenticated with check (rated_by = (select auth.uid()));

-- reports (private to reporter and admins)
create policy "reports read own" on public.reports
  for select to authenticated using (reporter_id = (select auth.uid()) or public.is_admin());
create policy "reports insert as self" on public.reports
  for insert to authenticated with check (reporter_id = (select auth.uid()));

-- favorites
create policy "favorites read own" on public.favorites
  for select to authenticated using (user_id = (select auth.uid()));
create policy "favorites insert own" on public.favorites
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "favorites delete own" on public.favorites
  for delete to authenticated using (user_id = (select auth.uid()));
