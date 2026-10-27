-- ---------- helpers ----------
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

-- Is manual approval being enforced right now? (feature flag, off at launch)
create or replace function public.approval_required()
returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce((select s.require_pet_approval from public.app_settings s limit 1), false);
$$;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end $$;

-- Age in full months, comparing real dates (fixes the plan's month-only bug)
create or replace function public.pet_age_months(p_dob date)
returns integer language sql stable as $$
  select (extract(year from age(current_date, p_dob)) * 12
        + extract(month from age(current_date, p_dob)))::int;
$$;

create or replace function public.min_breeding_age_months(p_species public.species_t, p_breed text)
returns integer language sql stable as $$
  select coalesce(
    (select o.min_age_months from public.breed_age_overrides o
       where o.species = p_species and o.breed = lower(p_breed)),
    (select r.min_age_months from public.breeding_age_rules r where r.species = p_species),
    12);
$$;

create or replace function public.is_breeding_eligible(p_species public.species_t, p_breed text, p_dob date)
returns boolean language sql stable as $$
  select public.pet_age_months(p_dob) >= public.min_breeding_age_months(p_species, p_breed);
$$;

-- ---------- new auth user -> profile rows ----------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, name, avatar_url)
  values (
    new.id,
    left(coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'New user'), 60),
    new.raw_user_meta_data->>'avatar_url'
  );
  insert into public.profile_private (id, email)
  values (new.id, new.email);
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger profile_private_updated_at before update on public.profile_private
  for each row execute function public.set_updated_at();

-- ---------- pets: validation, privacy snap, age gate ----------
create or replace function public.pets_before_write()
returns trigger language plpgsql security definer set search_path = public, extensions as $$
declare
  v_trusted boolean;
  v_count integer;
  v_admin boolean := (auth.uid() is null) or public.is_admin();  -- dashboard/service role or admin
begin
  if new.date_of_birth > current_date then
    raise exception 'Date of birth cannot be in the future';
  end if;

  -- PRIVACY: never store exact home coordinates. Snap to ~0.005 degrees (~500 m).
  new.location := st_snaptogrid(new.location::geometry, 0.005)::geography;
  new.lat := st_y(new.location::geometry);
  new.lng := st_x(new.location::geometry);

  new.updated_at := now();

  if tg_op = 'INSERT' then
    select p.trusted into v_trusted from public.profiles p where p.id = new.owner_id;
    v_trusted := coalesce(v_trusted, false);
    if not v_admin then
      new.verified := false;
      new.hidden := false;
      -- launch mode: approval OFF -> everyone auto-approved. When you switch
      -- require_pet_approval on, only trusted owners are auto-approved.
      new.approved := v_trusted or not public.approval_required();
      select count(*) into v_count from public.pets x
        where x.owner_id = new.owner_id and x.status <> 'archived';
      if v_count >= 5 and not v_trusted then
        raise exception 'Pet limit reached (5 active pets). Archive one or contact support.';
      end if;
    end if;
  else
    -- changing identity fields invalidates verification and requires re-approval
    if not v_admin and (
         new.species is distinct from old.species
      or new.breed is distinct from old.breed
      or new.date_of_birth is distinct from old.date_of_birth
      or new.registration_number is distinct from old.registration_number
      or new.certificate_url is distinct from old.certificate_url) then
      new.verified := false;
    end if;
  end if;

  -- owner must self-attest before a pet can be marked available
  if new.breeding_status = 'available' and not new.owner_attests_breeding_ready then
    raise exception 'Please confirm the pet is healthy and ready for breeding before setting it as available.';
  end if;

  -- age gate: below minimum age the pet cannot be available (soft: listing allowed)
  if new.breeding_status = 'available'
     and not public.is_breeding_eligible(new.species, new.breed, new.date_of_birth) then
    new.breeding_status := 'not_available';
  end if;

  return new;
end $$;

create trigger pets_before_write
  before insert or update on public.pets
  for each row execute function public.pets_before_write();

-- keep owner "verified_owner" badge in sync
create or replace function public.sync_verified_owner()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.profiles p
     set verified_owner = exists (select 1 from public.pets x where x.owner_id = new.owner_id and x.verified)
   where p.id = new.owner_id;
  return new;
end $$;

create trigger pets_sync_verified_owner
  after insert or update of verified on public.pets
  for each row execute function public.sync_verified_owner();

-- ---------- match requests: all rules enforced here ----------
create or replace function public.match_requests_before_insert()
returns trigger language plpgsql security definer set search_path = public, extensions as $$
declare
  t public.pets;         -- target pet
  s public.pets;         -- sender's pet
  v_trusted boolean;
  v_phone text;
  v_recent integer;
begin
  select * into t from public.pets where id = new.pet_id;
  select * into s from public.pets where id = new.sender_pet_id;
  if t.id is null or s.id is null then raise exception 'Pet not found'; end if;

  if s.owner_id <> new.sender_id then raise exception 'You can only offer your own pet'; end if;
  if t.owner_id = s.owner_id     then raise exception 'You cannot send a request to your own pet'; end if;
  if t.species <> s.species      then raise exception 'Species must match'; end if;
  if t.gender = s.gender         then raise exception 'Pets must be of opposite gender'; end if;

  if t.status <> 'active' or not t.approved or t.hidden or t.breeding_status <> 'available' then
    raise exception 'This pet is not available right now';
  end if;
  if s.status <> 'active' or s.breeding_status <> 'available' then
    raise exception 'Your pet is not set as available';
  end if;
  if not s.approved or s.hidden then
    raise exception 'Your pet is still waiting for approval';
  end if;
  if not public.is_breeding_eligible(t.species, t.breed, t.date_of_birth)
     or not public.is_breeding_eligible(s.species, s.breed, s.date_of_birth) then
    raise exception 'Both pets must have reached breeding age';
  end if;

  -- sender must have a phone number on file (it is shared only after acceptance)
  select pp.phone into v_phone from public.profile_private pp where pp.id = new.sender_id;
  if v_phone is null then raise exception 'Add your phone number in your profile before sending requests'; end if;

  -- anti-spam: 3 requests per 24h unless trusted
  select p.trusted into v_trusted from public.profiles p where p.id = new.sender_id;
  select count(*) into v_recent from public.match_requests r
    where r.sender_id = new.sender_id and r.created_at > now() - interval '24 hours';
  if v_recent >= 3 and not coalesce(v_trusted, false) then
    raise exception 'Daily request limit reached. Try again tomorrow.';
  end if;

  new.recipient_id := t.owner_id;           -- never trust the client for this
  new.status := 'new';
  new.created_at := now();
  new.responded_at := null;
  new.completed_at := null;
  new.relative_warning := (s.litter_ref is not null and s.litter_ref = t.litter_ref);
  return new;
end $$;

create trigger match_requests_before_insert
  before insert on public.match_requests
  for each row execute function public.match_requests_before_insert();

-- ---------- ratings ----------
create or replace function public.ratings_before_insert()
returns trigger language plpgsql security definer set search_path = public as $$
declare r public.match_requests;
begin
  select * into r from public.match_requests where id = new.match_request_id;
  if r.id is null or r.status <> 'completed' then
    raise exception 'You can rate only after a completed match';
  end if;
  if new.rated_by not in (r.sender_id, r.recipient_id) then
    raise exception 'You were not part of this match';
  end if;
  new.rated_user := case when new.rated_by = r.sender_id then r.recipient_id else r.sender_id end;
  return new;
end $$;

create trigger ratings_before_insert
  before insert on public.ratings
  for each row execute function public.ratings_before_insert();

create or replace function public.ratings_after_insert()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.profiles p
     set rating_count = s.c, rating_avg = s.a
    from (select count(*)::int as c, coalesce(round(avg(rating)::numeric, 2), 0) as a
            from public.ratings where rated_user = new.rated_user) s
   where p.id = new.rated_user;
  return new;
end $$;

create trigger ratings_after_insert
  after insert on public.ratings
  for each row execute function public.ratings_after_insert();

-- ---------- reports: fill reported user, auto-hide at 3 distinct reporters ----------
create or replace function public.reports_before_insert()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.reported_pet_id is not null then
    select p.owner_id into new.reported_user_id from public.pets p where p.id = new.reported_pet_id;
  end if;
  if new.reported_user_id = new.reporter_id then
    raise exception 'You cannot report yourself';
  end if;
  new.status := 'open';
  return new;
end $$;

create trigger reports_before_insert
  before insert on public.reports
  for each row execute function public.reports_before_insert();

create or replace function public.reports_after_insert()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.reported_pet_id is not null and
     (select count(distinct r.reporter_id) from public.reports r
        where r.reported_pet_id = new.reported_pet_id and r.status = 'open') >= 3 then
    update public.pets set hidden = true where id = new.reported_pet_id;
  end if;
  return new;
end $$;

create trigger reports_after_insert
  after insert on public.reports
  for each row execute function public.reports_after_insert();
