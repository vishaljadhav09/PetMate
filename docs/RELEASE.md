# PetMate Release Runbook

Covers tasks T8.5 to T8.7 in `BACKEND_TASKS.md`. Do these in order. Everything marked **You** needs your own logins.

## 0. Before you start

- [ ] `npm run validate` and `npm test` pass.
- [ ] Every migration in `supabase/migrations/` has been applied to **dev** and tested.
- [ ] The two-user flow (send, accept, contact, complete, rate) works on real phones against dev.
- [ ] Push works on a real phone (new request, accepted).
- [ ] Privacy policy and terms are reviewed, filled in and published at public URLs.

## 1. Create the production project (You)

1. supabase.com → **New project** → name `petmate-prod`, region near India, a **different** database password. Save the password.
2. Note the project ref, URL and anon key.

## 2. Push the database to production

```bash
npx supabase link --project-ref <PROD_REF>
npx supabase db dump --linked -f backup_before_release.sql     # empty at first, but build the habit
npx supabase db push --linked
```

Check it:

```bash
npx supabase db query --linked "select count(*) as tables_without_rls from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relkind='r' and not c.relrowsecurity"
```

The result must be `0`.

> `db dump` needs Docker Desktop running. If you do not use Docker, take backups from _Dashboard → Database → Backups_ (Pro plan) or run `pg_dump` against the connection string.

## 3. Secrets and Edge Functions (production)

Use a **new** webhook secret. Never reuse the dev one.

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
npx supabase secrets set WEBHOOK_SECRET=<new value>
npx supabase secrets set CLOUDINARY_CLOUD_NAME=... CLOUDINARY_API_KEY=... CLOUDINARY_API_SECRET=...
npx supabase functions deploy send-push cloudinary-sign delete-account
```

## 4. Database webhook (You)

_Dashboard → Database → Webhooks → Create_: table `match_requests`, events **Insert** and **Update**, HTTP POST to
`https://<PROD_REF>.supabase.co/functions/v1/send-push`, header `x-webhook-secret` = the prod secret.

## 5. Google sign-in for production (You)

1. Google Cloud → Credentials: add the production **Web** client's redirect URI `https://<PROD_REF>.supabase.co/auth/v1/callback` (or create a separate prod Web client).
2. Supabase prod → _Authentication → Providers → Google_: enable, paste the Web client ID and secret.
3. Supabase prod → _Authentication → URL Configuration_: set the Site URL.
4. After the first Play upload, add the **Play App Signing SHA-1** (_Play Console → Setup → App signing_) to the Google Android OAuth client. Without it, Google sign-in fails in the Play build.

## 5b. Make yourself admin (production)

Sign in once in the app, then in the SQL editor:

```sql
insert into public.admins (user_id) select id from auth.users where email = '<your google email>';
```

## 6. Production app build (You)

1. In expo.dev → _Environment variables_, create the **production** values: prod `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_PUBLISHED_KEY`, the Google web client ID, and the EAS project ID.
2. `eas build --profile production --platform android` (produces an AAB).
3. Install-test a preview build first (`--profile preview`) pointed at prod.

## 7. Play Store (You)

- [ ] Play developer account ($25). New personal accounts may need a **closed test with a minimum number of testers for a minimum number of days** before production. Check the current rule first, because it can add weeks.
- [ ] Fill _App content_: privacy policy URL, data safety (`docs/legal/PLAY_DATA_SAFETY.md`), content rating, target audience 18+, app access (give reviewers a test Google account), ads (none).
- [ ] Account deletion: in-app (Profile → Delete account) **and** a public web page.
- [ ] Upload the AAB (`eas submit --platform android`, needs a Play service-account key) to **Internal testing**, then **Closed testing**, then **Production**.

## 8. After launch (T8.7)

- **Backups (free plan has none):** weekly `npx supabase db dump --linked -f backup_$(date +%F).sql` and a data-only dump. Store them privately. Practise a restore into dev once.
- **Keep-alive:** add `SUPABASE_URL` and `SUPABASE_ANON_KEY` (prod) as GitHub Actions secrets so `.github/workflows/keep-supabase-alive.yml` can ping every 3 days. This is a stopgap.
- **Weekly checks:** Dashboard → Reports for database size (< 400 MB), egress (< 4 GB), errors; open reports; Cloudinary usage monthly.
- **Move to Pro (about $25 per month)** when real users depend on the app, the database nears 400 MB, egress nears the cap, or you want daily backups. Then remove the keep-alive.

## Security checklist (verified on dev, re-run on prod)

Run the same audit on prod after `db push`. Expected: every table has row security on, `anon` can only read the two config tables and call `ping`, no client-writable protected columns (`verified`, `approved`, `hidden`, `trusted`, rating columns, `recipient_id`, `rated_user`), every security-definer function pins `search_path`, phone numbers exist only in `profile_private`, no public storage buckets.

Still manual: the service-role key exists only in Edge Function secrets; Cloudinary has no unsigned upload preset; dev and prod secrets differ; CAPTCHA and rate limits are on if you add email login.
