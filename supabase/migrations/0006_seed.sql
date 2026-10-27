-- Default breeding-age rules. Treat as defaults, not veterinary advice; have a vet review them.
insert into public.breeding_age_rules (species, min_age_months) values
  ('dog', 12), ('cat', 10), ('rabbit', 6), ('bird', 12), ('horse', 36), ('other', 12)
on conflict (species) do update set min_age_months = excluded.min_age_months;

-- Example overrides (verify with a vet before using): larger dog breeds are usually bred later
insert into public.breed_age_overrides (species, breed, min_age_months) values
  ('dog', 'great dane', 24),
  ('dog', 'german shepherd', 18),
  ('dog', 'labrador retriever', 18)
on conflict (species, breed) do nothing;

-- Approval feature flag stays OFF at launch (also created in 0002; this just makes sure of it)
update public.app_settings set require_pet_approval = false;
