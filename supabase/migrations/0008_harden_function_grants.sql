-- Postgres lets everyone (PUBLIC, including the logged-out `anon` role) execute new functions
-- by default. Close that: only signed-in users may call the app's functions, and only `ping`
-- (the keep-alive) stays open to `anon`.
revoke execute on all functions in schema public from public, anon;

grant execute on function
  public.is_admin(),
  public.approval_required(),
  public.pet_age_months(date),
  public.min_breeding_age_months(public.species_t, text),
  public.is_breeding_eligible(public.species_t, text, date),
  public.nearby_pets(double precision, double precision, integer, uuid, public.species_t, text,
                     boolean, boolean, integer, integer),
  public.set_match_request_status(uuid, public.request_status_t),
  public.get_match_contact(uuid)
to authenticated;

grant execute on function public.ping() to anon, authenticated;

-- Functions created later start locked down too.
alter default privileges in schema public revoke execute on functions from public, anon;
