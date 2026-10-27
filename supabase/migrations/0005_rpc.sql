-- ============ nearby compatible pets ============
create or replace function public.nearby_pets(
  p_lat double precision,
  p_lng double precision,
  p_radius_m integer default 10000,
  p_my_pet_id uuid default null,          -- if given: same species + opposite gender enforced
  p_species public.species_t default null,
  p_breed text default null,
  p_verified_only boolean default false,
  p_vaccinated_only boolean default false,
  p_limit integer default 30,
  p_offset integer default 0
)
returns table (
  id uuid, owner_id uuid, pet_name text, species public.species_t, breed text,
  gender public.gender_t, age_months integer, photos text[], description text,
  pedigree_certified boolean, vaccination_up_to_date boolean, verified boolean,
  stud_fee_type public.stud_fee_type_t, stud_fee integer, city text,
  lat double precision, lng double precision, distance_m double precision,
  owner_name text, owner_rating numeric, owner_rating_count integer, owner_verified boolean
)
language plpgsql stable security invoker set search_path = public, extensions as $$
declare
  v_origin  geography := st_setsrid(st_makepoint(p_lng, p_lat), 4326)::geography;
  v_species public.species_t := p_species;
  v_gender  public.gender_t := null;
  v_my      public.pets;
begin
  if auth.uid() is null then raise exception 'Not signed in'; end if;

  p_radius_m := least(greatest(p_radius_m, 500), 100000);   -- 0.5 km .. 100 km
  p_limit    := least(greatest(p_limit, 1), 50);
  p_offset   := greatest(p_offset, 0);

  if p_my_pet_id is not null then
    select mp.* into v_my from public.pets mp where mp.id = p_my_pet_id and mp.owner_id = auth.uid();
    if v_my.id is null then raise exception 'Pet not found'; end if;
    v_species := v_my.species;
    v_gender  := case v_my.gender when 'male' then 'female'::public.gender_t
                                  else 'male'::public.gender_t end;
  end if;

  return query
  select p.id, p.owner_id, p.pet_name, p.species, p.breed, p.gender,
         public.pet_age_months(p.date_of_birth), p.photos, p.description,
         p.pedigree_certified, p.vaccination_up_to_date, p.verified,
         p.stud_fee_type, p.stud_fee, p.city, p.lat, p.lng,
         st_distance(p.location, v_origin),
         o.name, o.rating_avg, o.rating_count, o.verified_owner
    from public.pets p
    join public.profiles o on o.id = p.owner_id
   where st_dwithin(p.location, v_origin, p_radius_m)
     and p.status = 'active' and p.approved and not p.hidden
     and p.breeding_status = 'available'
     and p.owner_id <> auth.uid()
     and public.pet_age_months(p.date_of_birth) >= public.min_breeding_age_months(p.species, p.breed)
     and (v_species is null or p.species = v_species)
     and (v_gender  is null or p.gender  = v_gender)
     and (p_breed   is null or p.breed ilike '%' || p_breed || '%')
     and (not p_verified_only   or p.verified)
     and (not p_vaccinated_only or p.vaccination_up_to_date)
   order by st_distance(p.location, v_origin)
   limit p_limit offset p_offset;
end $$;

-- ============ request status changes (only way to change status) ============
create or replace function public.set_match_request_status(
  p_id uuid, p_status public.request_status_t)
returns public.match_requests
language plpgsql security definer set search_path = public as $$
declare
  r   public.match_requests;
  uid uuid := auth.uid();
begin
  if uid is null then raise exception 'Not signed in'; end if;

  select * into r from public.match_requests where id = p_id for update;
  if r.id is null or uid not in (r.sender_id, r.recipient_id) then
    raise exception 'Request not found';
  end if;

  if r.status = 'new' and uid = r.recipient_id and p_status in ('accepted','declined') then
    update public.match_requests set status = p_status, responded_at = now()
     where id = p_id returning * into r;
  elsif r.status = 'new' and uid = r.sender_id and p_status = 'cancelled' then
    update public.match_requests set status = 'cancelled', responded_at = now()
     where id = p_id returning * into r;
  elsif r.status = 'accepted' and p_status = 'completed' then
    update public.match_requests set status = 'completed', completed_at = now()
     where id = p_id returning * into r;
  else
    raise exception 'That status change is not allowed';
  end if;
  return r;
end $$;

-- ============ contact reveal (only after acceptance) ============
create or replace function public.get_match_contact(p_request_id uuid)
returns table (contact_name text, contact_phone text)
language plpgsql security definer set search_path = public as $$
declare
  r public.match_requests;
  v_other uuid;
begin
  select * into r from public.match_requests where id = p_request_id;
  if r.id is null or auth.uid() is null or auth.uid() not in (r.sender_id, r.recipient_id) then
    raise exception 'Request not found';
  end if;
  if r.status not in ('accepted','completed') then
    raise exception 'Contact details are shared only after the request is accepted';
  end if;
  v_other := case when auth.uid() = r.sender_id then r.recipient_id else r.sender_id end;
  return query
    select p.name, pp.phone
      from public.profiles p join public.profile_private pp on pp.id = p.id
     where p.id = v_other;
end $$;

-- ============ keep-alive ping (touches the database) ============
create or replace function public.ping()
returns text language sql stable as $$
  select 'ok'::text from public.breeding_age_rules limit 1;
$$;

-- ============ who may call what ============
revoke execute on function public.nearby_pets(double precision, double precision, integer, uuid,
  public.species_t, text, boolean, boolean, integer, integer) from public, anon;
grant  execute on function public.nearby_pets(double precision, double precision, integer, uuid,
  public.species_t, text, boolean, boolean, integer, integer) to authenticated;

revoke execute on function public.set_match_request_status(uuid, public.request_status_t) from public, anon;
grant  execute on function public.set_match_request_status(uuid, public.request_status_t) to authenticated;

revoke execute on function public.get_match_contact(uuid) from public, anon;
grant  execute on function public.get_match_contact(uuid) to authenticated;

grant execute on function public.ping() to anon, authenticated;
