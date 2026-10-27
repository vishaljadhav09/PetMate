-- ============ admins (no client access at all) ============
create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ============ app settings (feature flags, single row) ============
create table public.app_settings (
  id boolean primary key default true check (id),          -- forces exactly one row
  require_pet_approval boolean not null default false,     -- false = new pets are auto-approved (launch mode)
  updated_at timestamptz not null default now()
);
insert into public.app_settings (id) values (true) on conflict do nothing;

-- ============ breeding-age configuration ============
create table public.breeding_age_rules (
  species public.species_t primary key,
  min_age_months integer not null check (min_age_months between 1 and 120)
);

-- per-breed overrides (for example large breeds need more time)
create table public.breed_age_overrides (
  species public.species_t not null,
  breed text not null,                      -- stored lower-case
  min_age_months integer not null check (min_age_months between 1 and 120),
  primary key (species, breed)
);

-- ============ profiles (public info) ============
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default 'New user' check (char_length(name) between 1 and 60),
  avatar_url text,
  city text check (char_length(city) <= 80),
  bio text check (char_length(bio) <= 300),
  rating_avg numeric(3,2) not null default 0,
  rating_count integer not null default 0,
  verified_owner boolean not null default false,   -- set automatically when owner has a verified pet
  trusted boolean not null default false,          -- you set this; skips approval + limits
  last_active timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============ profile_private (own row only) ============
create table public.profile_private (
  id uuid primary key references public.profiles(id) on delete cascade,
  email text,
  phone text check (phone is null or phone ~ '^\+[1-9][0-9]{7,14}$'),  -- E.164, e.g. +919876543210
  push_token text,
  updated_at timestamptz not null default now()
);

-- ============ pets ============
create table public.pets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  pet_name text not null check (char_length(pet_name) between 1 and 60),
  species public.species_t not null default 'dog',
  breed text not null check (char_length(breed) between 1 and 80),
  gender public.gender_t not null,
  date_of_birth date not null check (date_of_birth > date '1990-01-01'),
  photos text[] not null default '{}' check (cardinality(photos) <= 4),
  description text check (char_length(description) <= 1000),
  pedigree_certified boolean not null default false,
  registration_number text check (char_length(registration_number) <= 40),
  vaccination_up_to_date boolean not null default false,
  last_vet_checkup date,
  hip_score text check (char_length(hip_score) <= 40),
  certificate_url text,                                 -- health/pedigree document image
  litter_ref text check (char_length(litter_ref) <= 60),-- optional shared litter/parent reference (advisory only)
  owner_attests_breeding_ready boolean not null default false,
  breeding_status public.breeding_status_t not null default 'not_available',
  stud_fee_type public.stud_fee_type_t not null default 'negotiable',
  stud_fee integer check (stud_fee is null or stud_fee between 0 and 1000000),  -- INR
  location extensions.geography(point,4326) not null,   -- SNAPPED to ~500 m by trigger
  lat double precision,                                 -- set by trigger from snapped location
  lng double precision,
  city text check (char_length(city) <= 80),
  verified boolean not null default false,              -- admin only
  approved boolean not null default false,              -- admin only; set by trigger: true unless require_pet_approval is on
  hidden boolean not null default false,                -- admin / auto-hide on reports
  status public.pet_status_t not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index pets_location_gix on public.pets using gist (location);
create index pets_owner_idx    on public.pets (owner_id);
create index pets_listing_idx  on public.pets (species, gender)
  where status = 'active' and approved and not hidden and breeding_status = 'available';
create index pets_breed_trgm   on public.pets using gin (breed extensions.gin_trgm_ops);
create index pets_name_trgm    on public.pets using gin (pet_name extensions.gin_trgm_ops);

-- ============ match_requests ============
create table public.match_requests (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  sender_pet_id uuid not null references public.pets(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,  -- set by trigger
  pet_id uuid not null references public.pets(id) on delete cascade,            -- requested pet
  message text check (char_length(message) <= 500),
  proposed_date date,
  status public.request_status_t not null default 'new',
  relative_warning boolean not null default false,      -- advisory: same litter_ref
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  completed_at timestamptz,
  check (sender_id <> recipient_id)
);

-- one live request per pair of pets
create unique index match_requests_live_pair
  on public.match_requests (sender_pet_id, pet_id)
  where status in ('new','accepted');
create index match_requests_inbox_idx on public.match_requests (recipient_id, status, created_at desc);
create index match_requests_sent_idx  on public.match_requests (sender_id, created_at desc);

-- ============ ratings ============
create table public.ratings (
  id uuid primary key default gen_random_uuid(),
  match_request_id uuid not null references public.match_requests(id) on delete cascade,
  rated_by uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  rated_user uuid not null references public.profiles(id) on delete cascade,   -- set by trigger
  rating smallint not null check (rating between 1 and 5),
  comment text check (char_length(comment) <= 500),
  created_at timestamptz not null default now(),
  unique (match_request_id, rated_by)
);
create index ratings_user_idx on public.ratings (rated_user, created_at desc);

-- ============ reports ============
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  reported_pet_id uuid references public.pets(id) on delete cascade,
  reported_user_id uuid references public.profiles(id) on delete cascade,
  reason public.report_reason_t not null,
  details text check (char_length(details) <= 1000),
  status public.report_status_t not null default 'open',
  admin_note text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  check (reported_pet_id is not null or reported_user_id is not null)
);
create unique index reports_one_per_pet on public.reports (reporter_id, reported_pet_id) where reported_pet_id is not null;
create index reports_queue_idx on public.reports (status, created_at desc);

-- ============ favorites ============
create table public.favorites (
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  pet_id uuid not null references public.pets(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, pet_id)
);
