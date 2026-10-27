---
name: audit-app
description: After changes, verify the whole app still works — run checks, fix what's broken, and loop until clean
auto-invocable: true
triggers:
  - audit the app
  - check if anything broke
  - is the app broken
  - verify everything still works
  - full app check
---

# Audit App

Run after `build-feature` (or any manual change) to catch breakage — not just in the files that were
touched, but anywhere those changes could have rippled to. Fix what's found, then re-check. Stop only
when a full pass is clean, or when remaining issues genuinely require a decision from the user.

This is broader than `validate-conventions`: that skill lints the current diff against
`CONVENTIONS.md`; this skill also checks whole-app compile/runtime health and cross-cutting
consistency (i18n parity, leftover migration artifacts, secret hygiene, dead routes). Use its rule
checklist as one input here instead of re-deriving it.

## The loop

1. Run the full automated check suite (section 1).
2. Run the structural checks (section 2) relevant to what changed.
3. If anything failed: fix it directly, in the code — don't suppress, don't skip, don't ask the user
   to fix it unless it's a genuine product/requirements decision.
4. Go back to step 1 and run the **entire** suite again, not just the check that failed — a fix can
   introduce a new issue elsewhere.
5. Stop when a full pass (steps 1–2) comes back clean.
6. If the same failure survives 5 full passes without a decreasing issue count, stop looping, report
   exactly what's left and why it's stuck (e.g. a missing decision, an external dependency issue,
   a flaky test), and ask the user rather than continuing to churn.

## 1. Automated checks (run in this order — fail fast on the cheap ones)

```bash
npm run type-check
npm run lint
npm run format:check
npm test
```

If any Expo/native config changed (new package, `app.json`, `babel.config.js`, `metro.config.js`),
also run `npx expo-doctor` to catch SDK/dependency incompatibilities the above won't.

`npm run validate` runs type-check + lint + format together — fine to use as the fast recheck in the
loop, but run `npm test` separately since `validate` doesn't include it.

## 2. Structural checks (things the tools above won't catch)

Scope these to what actually changed, but widen to the whole app if the change was systemic (a theme
migration, a shared component, a renamed constant):

- **Styling consistency**: if a NativeWind migration is in progress or claimed complete, grep for
  leftover `StyleSheet.create`, `useVariants`, or `react-native-unistyles` imports — a component still
  on the old system after migration is "done" is a real bug, not a style nit. Also grep `className=`
  for literal hex colors or arbitrary-value classes that bypass the design tokens.
- **i18n parity**: diff the key sets of `en.json` and `ar.json` — every key must exist in both. Grep
  changed JSX for string literals that look like user-facing text but aren't wrapped in `t()`.
- **Service layer boundary**: grep for `fetch(` / `axios.` outside `src/services/` — a hit means a
  component or hook is bypassing the service layer.
- **Env/secrets hygiene**: grep for `process.env.` outside `src/config/env.ts`; confirm every var
  referenced in code has a placeholder in `.env.example`; confirm `git status` shows no real `.env`
  staged; scan diffs for anything that looks like a live API key/token/credential.
- **Suppression leaks**: grep for `eslint-disable`, `@ts-ignore`, `@ts-nocheck`, `: any`, `as any` —
  the pre-commit hooks block new ones on write, but a bulk edit/codemod can slip past them.
- **Dead/orphaned routes**: for every new screen file under `app/`, confirm something actually
  navigates to it (a tab, a link, a `router.push`) unless it's intentionally deep-link-only —
  conversely, for every removed feature, confirm no remaining nav entry points at a route that no
  longer exists.
- **Barrel exports**: new components/modules are imported via their `index.ts`, not their
  implementation file, elsewhere in the codebase.
- **Constants/utils duplication**: grep for the same literal or near-identical helper function
  appearing in 2+ features — a sign something should have been promoted to `src/constants/` or
  `src/utils/` per `build-feature` section 7–8.

## 3. Runtime sanity check

Static checks can pass while the app still doesn't run. Use the `run` skill to actually launch the app
and confirm it bundles and boots without a red-screen error, and exercise the specific screen(s) that
changed. If there's no way to verify on a device/simulator in this environment, say so explicitly in
the final report — don't report "PASS" for something that was never actually run.

## 4. Fix, don't just report, then loop

For every issue found in sections 1–3, fix it in the same pass before re-running the suite — this
skill's job is "make it work again," not "list what's wrong." Exceptions that go to the user instead of
being auto-fixed:

- The fix requires a product decision (e.g. which of two conflicting requirements wins)
- The fix requires a credential/external account the agent doesn't have
- The same fix has already failed 2+ times in the loop (see stop condition above)

## 5. Final report

```
## Audit: <scope>

Passes run: N

### Automated checks (final pass)
type-check: PASS/FAIL
lint:       PASS/FAIL
format:     PASS/FAIL
test:       PASS/FAIL
expo-doctor: PASS/FAIL/not run

### Structural checks
- Styling consistency: clean / N issues fixed
- i18n parity: clean / N issues fixed
- Service layer boundary: clean / N issues fixed
- Env/secrets hygiene: clean / N issues fixed
- Suppression leaks: clean / N issues fixed
- Dead/orphaned routes: clean / N issues fixed
- Barrel exports: clean / N issues fixed
- Constants/utils duplication: clean / N issues fixed

### Runtime
Verified by launching the app: yes/no (explain if no)

### Remaining (if any)
- <issue> — <why it wasn't auto-fixed, what decision is needed>
```

## Critical rules

- Never mark something PASS without having actually run it in this session.
- Never suppress an error to make a check go green — fix the underlying cause.
- Re-run the _whole_ suite after every fix, not just the check that failed.
- Cap the loop at 5 full passes; report and ask rather than looping forever on a stuck issue.
- Prefer fixing over asking, but escalate the exceptions listed in section 4 rather than guessing at a
  product decision.
