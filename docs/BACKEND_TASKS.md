# PetMate Supabase Backend: Task Tracker

Source: `PETMATE_SUPABASE_BACKEND_GUIDE.md` (section numbers in brackets).
Legend: `[x]` done in repo, `[ ]` to do. Nothing has been run against a real Supabase project yet.

## Phase 0: Accounts and project setup [5]

- [ ] T0.1 Create Supabase projects `petmate-dev` and `petmate-prod` (region near India)
- [ ] T0.2 Create Cloudinary, Google Cloud, Expo (EAS) accounts
- [x] T0.3 Supabase CLI installed (2.122.0), `supabase init` done, `send-push` setting merged into `config.toml`. Still to do by you: `npx supabase login` + `npx supabase link --project-ref <DEV_REF>`
- [x] T0.4 `env.ts` and `.env.example` now include `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` and `EXPO_PUBLIC_EAS_PROJECT_ID` (repo uses `EXPO_PUBLIC_SUPABASE_PUBLISHED_KEY` for the anon key). Still to do by you: fill real values in `.env`
- [ ] T0.5 Set Edge Function secrets (`WEBHOOK_SECRET`, Cloudinary keys)

## Phase 1: Database [7, 8, 9, 11.3]

- [x] T1.1 Migrations 0001-0007 written (`supabase/migrations/`)
- [x] T1.2 `supabase db push` to dev; fix any SQL errors
- [x] T1.3 Run RLS coverage query (guide section 16); all tables must show true
- [ ] T1.4 Run the 28 test cases with two test users (guide section 17.2)
- [ ] T1.5 Add yourself to `admins` (guide section 14.1)
- [x] T1.6 Generate types: `supabase gen types typescript` to `src/types/database.ts`

## Phase 2: Edge Functions and infra [10, 15]

- [x] T2.1 `send-push`, `cloudinary-sign`, `delete-account` written
- [x] T2.2 Keep-alive GitHub workflow written
- [x] T2.3 Deploy the three functions to dev
- [ ] T2.4 Create the `match_requests` database webhook (INSERT + UPDATE) with the `x-webhook-secret` header
- [ ] T2.5 Add GitHub secrets for the keep-alive workflow (prod only)

## Phase 3: Auth [6, 12.2, 12.3]

- [ ] T3.1 Configure Google OAuth (web + Android client, SHA-1) and enable provider in Supabase
- [x] T3.2 Reuse `src/integrations/supabase.ts`; confirm client typed with `Database`
- [x] T3.3 Auth service: Google sign-in, sign-out, delete account (no `any`)
- [x] T3.4 Wire into existing `useAuthStore` / `useAuthInit`; gate tabs behind sign-in
- [x] T3.5 Profile screen: name, city, phone (E.164), "not verified" note
- [x] T3.6 Delete-account button in profile
- [ ] T3.7 Create EAS development build (Google sign-in needs it)

## Phase 4: Pets [12.5, 12.6, 12.9, 11]

- [ ] T4.1 Update Pet types, Zod schemas and snake/camel mappers
- [ ] T4.2 `petsService`: create, edit, list mine, get detail (replace mock)
- [ ] T4.3 Photo upload: compress, Cloudinary signed upload, max 4 photos
- [ ] T4.4 Add/edit pet form: health fields, attestation, stud fee, location
- [ ] T4.5 My Pets: "pending approval" and "hidden" badges (dormant while approval is off)
- [ ] T4.6 Certificate upload to private bucket; verified badge display

## Phase 5: Discover [12.8]

- [ ] T5.1 GPS permission + manual city fallback
- [ ] T5.2 `nearby_pets` service with radius slider, filters, pagination
- [ ] T5.3 Pick "which of my pets" (`myPetId`) selector
- [ ] T5.4 Map markers, "approximate location" label, real `distance_m`
- [ ] T5.5 Pet detail with owner trust info

## Phase 6: Requests, ratings, reports, favorites [12.6, 12.7]

- [ ] T6.1 Send request, inbox, sent lists
- [ ] T6.2 Accept / decline / cancel / complete via RPC
- [ ] T6.3 Contact reveal after acceptance; relative-warning UI
- [ ] T6.4 Ratings after completion
- [ ] T6.5 Report dialog
- [ ] T6.6 Favorites
- [ ] T6.7 `friendlyError` mapper and i18n strings (EN + AR) for all new text

## Phase 7: Push notifications [10.1, 12.10]

- [ ] T7.1 FCM credentials in EAS
- [ ] T7.2 `registerPushToken` after sign-in
- [ ] T7.3 Notification tap opens Requests tab
- [ ] T7.4 Test on a real Android device

## Phase 8: Cleanup and release [15, 16, 20]

- [ ] T8.1 Remove mock data layer (or keep behind `EXPO_PUBLIC_USE_MOCK` until done)
- [ ] T8.2 `npm run validate` and tests pass
- [ ] T8.3 Security checklist (guide section 16)
- [ ] T8.4 Privacy policy, terms, Play data-safety form
- [ ] T8.5 Production: link prod, backup, `db push`, deploy functions, webhook, OAuth, admin
- [ ] T8.6 Play Store closed testing, then release
- [ ] T8.7 Weekly backup routine; decide Free vs Pro
