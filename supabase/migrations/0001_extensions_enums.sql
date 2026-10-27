-- PostGIS for geography, pg_trgm for fast breed/name search
create extension if not exists postgis with schema extensions;
create extension if not exists pg_trgm with schema extensions;

create type public.species_t        as enum ('dog','cat','bird','horse','rabbit','other');
create type public.gender_t         as enum ('male','female');
create type public.breeding_status_t as enum ('available','matched','resting','not_available');
create type public.stud_fee_type_t  as enum ('fee','pick_of_litter','free','negotiable');
create type public.pet_status_t     as enum ('active','paused','archived');
create type public.request_status_t as enum ('new','accepted','declined','completed','cancelled');
create type public.report_reason_t  as enum ('underage_pet','no_health_docs','spam','scam','abuse_concern','other');
create type public.report_status_t  as enum ('open','reviewed','actioned','dismissed');
