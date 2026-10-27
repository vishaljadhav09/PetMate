---
name: plan-feature
description: Produce a codebase-aware implementation plan for a feature/spec before any code is written
auto-invocable: true
triggers:
  - plan a feature
  - plan this feature
  - how should we build this
  - plan out this app
  - create implementation plan
  - break this down
---

# Plan Feature

Produce a concrete, codebase-aware implementation plan **before** any code is written. This skill only
plans — it never edits files. Hand off to `build-feature` to execute the plan.

## When to use

- The user describes a feature, pastes/attaches a spec (PDF, doc, issue), or asks "how do we build X".
- A large request needs to be broken into an ordered sequence of independently-shippable steps.
- Skip this and go straight to `build-feature` for a small, unambiguous, single-file change.

## Steps

### 1. Read the full requirement first

If the user attached a spec (PDF, doc), read all of it before forming an opinion. Don't plan off a
partial read — specs often define rules (validation, trust/safety, data shape) later in the document
that change earlier-looking decisions.

### 2. Survey the existing codebase before proposing anything new

- `ls src/features/` — which feature modules already exist and could be extended vs. need to be new.
- Grep for domain terms from the spec that might already exist (types, screens, services) to avoid
  duplicating work.
- `ls src/common/components/` — which existing components already cover the UI needed. Reuse first;
  only plan a new common component when nothing existing fits.
- Check `app/` routing tree for where new screens/tabs belong and whether they need
  `(main)` (protected) or a public route.
- Check `src/services/api/` for the existing HTTP client pattern any new service layer should follow.
- Check `src/constants/` and `src/utils/` (create these if they don't exist yet — see `build-feature`)
  for shared logic that should be reused instead of duplicated per-feature.

### 3. Break the feature into modules

For each feature module needed, decide what's actually required (don't scaffold empty layers "just in
case"):

- **Types** — the domain shape, mirroring any backend schema given in the spec
- **Schema** — Zod validation, only for data that's user-submitted via a form
- **Service** — API methods, added to `src/services/api` and a feature `*Service.ts`
- **Hooks** — React Query hooks wrapping the service (server state) — never Zustand for server data
- **Store** — Zustand, only for state that is genuinely client-only (UI toggles, drafts, filters)
- **Constants** — feature-local constants vs. things that belong in the shared `src/constants/`
- **Components** — feature-specific UI; explicitly flag anything reusable enough to belong in
  `src/common/components` instead
- **Screens** — routes under `app/`, and whether each requires auth

### 4. Sequence the work so each step is independently testable

Default order (adjust per feature, but keep each step shippable on its own):

1. Types + schema
2. Service layer + query hooks (testable via a temporary console/log screen if no UI exists yet)
3. Common components needed that don't exist yet
4. Feature components
5. Screens + routing + navigation entry points (tabs, links, deep links)
6. i18n strings for every new user-facing string (EN + AR together)
7. `build-feature`'s own audit pass (type-check/lint/format) before moving to the next feature

### 5. Call out every cross-cutting need explicitly

Do not leave these implicit — list them per feature so `build-feature` doesn't miss them:

- New env vars → must be added to `.env.example` and validated in `src/config/env.ts`; never hardcoded
- New third-party SDKs/services → note any free-tier limits or cost if the spec mentions them
- New shared constants or utility functions that multiple features will need
- New i18n namespaces
- Any business rule that has real-world consequences if wrong (e.g. a safety/eligibility gate) —
  call out explicitly that it must be enforced server-side, with the client-side check treated as UX
  only, not the source of truth
- Anything the spec describes as "unchanged"/"copy-paste from X" — verify X actually exists in _this_
  codebase before assuming it can be copied; if it doesn't, plan it as new work instead of assuming
  it's free

### 6. Ask only genuinely blocking questions

Use AskUserQuestion, but only when the codebase and spec together don't already answer it. Examples of
real forks worth asking about:

- The spec names a field/screen that conflicts with something that already exists under a different
  name or shape
- The spec assumes a backend/service that doesn't exist in this repo yet (mock data vs. build the
  backend vs. defer) — do not build the backend
- Multiple independent features were requested at once and the build order isn't obvious

Do not ask about anything derivable by reading the code (styling system, folder conventions, existing
patterns) — go look instead.

### 7. Present the plan and stop

```
## Plan: <Feature Name>

### Reused as-is
- <existing component/service/screen> — no changes needed

### New/changed feature module(s)
- src/features/<name>/... (types, schema, service, hooks, store, constants, components)

### New/changed screens
- app/(main)/...

### Cross-cutting additions
- .env: <vars>
- i18n namespaces: <names>
- shared constants/utils: <what, and why it's shared not feature-local>

### Open risks / things to verify with the user
- <anything genuinely ambiguous>

### Sequence
1. ...
2. ...
```

End by asking whether to proceed with `build-feature` for step 1, or for the whole plan in one pass.

## Critical rules

- Never write or edit files in this skill — planning only.
- Always check what already exists before proposing a new file, component, or module.
- Keep the plan scoped to what was actually asked; do not plan speculative future features (note them
  under "Open risks" or a short "not now" list instead, don't design them).
- Name exact file paths in the plan, not vague descriptions — `build-feature` should be able to work
  from this plan without re-deriving structure.
