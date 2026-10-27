---
name: build-feature
description: Implement a planned feature end-to-end following this app's best-practice conventions (NativeWind theming, service layer, env/secrets, i18n, shared constants/utils)
auto-invocable: true
triggers:
  - build this feature
  - implement this feature
  - now build it
  - build the plan
  - implement the plan
---

# Build Feature

Implement code following this repo's conventions. If `plan-feature` produced a plan, work from it
file-by-file. For a small, unambiguous change, skip straight to the relevant section below.

This skill supersedes the styling guidance in `create-component`/`create-screen`/`create-form` where
they still say "unistyles" — this app's styling system is **NativeWind (Tailwind for React Native)**,
not `react-native-unistyles`. Section 0 below is the one-time cutover; run it before or alongside the
first real feature build if it hasn't happened yet.

## 0. One-time setup: NativeWind cutover (skip if already done)

Check first: does `tailwind.config.js` exist and is `nativewind` in `package.json`? If yes, skip to
section 1. If no, this is the first invocation — perform the full cutover before building new UI, so
new and old components don't disagree on how to style things.

1. **Install**: `nativewind`, `tailwindcss`, and `tailwind-variants` (for the variants pattern that
   replaces unistyles' `useVariants()`). Pin versions compatible with the installed Expo SDK — check
   NativeWind's own compatibility table for the SDK version in `package.json`, don't assume latest.
2. **Configure**: `tailwind.config.js` (content globs covering `app/**` and `src/**`), `global.css`
   with the three `@tailwind` directives, `babel.config.js` (add `nativewind/babel`), `metro.config.js`
   (wrap with `withNativeWind`), and import `global.css` once from the root layout (`app/_layout.tsx`).
3. **Port design tokens, don't invent new ones**: read `src/theme/light-theme.ts`, `dark-theme.ts`,
   `metrics.ts`, `fonts.ts`, and `config.ts` (theme _presets_, not just light/dark — check
   `THEME_PRESET_NAMES` before assuming there are only two themes) and translate every token into
   `tailwind.config.js` `theme.extend` using CSS variables (e.g. `background-app`, `text-primary`,
   `brand-primary`) so `dark:` variants and preset switching both work — a static two-theme
   `theme.extend.colors` object is not enough if presets exist. Keep spacing/radius/font-size scales
   equivalent to `metrics.ts` (`spacing`, `spacingV`, `fontSize`, `borderRadius`, `iconSize`) rather
   than falling back to Tailwind's stock scale, so existing visual rhythm doesn't shift.
4. **Preserve the public API of `src/theme/themeManager.ts`**: `applyThemePreset`, `toggleDarkMode`,
   `getCurrentMode`, `getCurrentPreset` are called from elsewhere in the app. Reimplement their
   internals against NativeWind's color-scheme/CSS-variable APIs, but keep the same function
   signatures so call sites don't need to change.
5. **Migrate every one of the 33 components in `src/common/components/`** from
   `StyleSheet.create((theme) => ...)` + `useVariants()` to `className` + `tailwind-variants`,
   one component at a time, checking each renders correctly in both light and dark before moving to
   the next. Do not leave a mix of migrated and unmigrated common components — a half-migrated shared
   component library is worse than not starting.
6. **Update the docs and sibling skills that currently teach unistyles**, so they don't contradict the
   new system: `CLAUDE.md` (Theme System, Styling, Key Rules sections), `CONVENTIONS.md` (Style Rules),
   `docs/AI-GUIDE.md`, `docs/COMPONENTS.md` examples, `AGENTS.md`, and the frontmatter/body of
   `.claude/skills/create-component/SKILL.md`, `create-screen/SKILL.md`, `create-form/SKILL.md`,
   `validate-conventions/SKILL.md` (its "Style Rules" checklist currently asserts unistyles-only
   imports). These are now "unwanted" content per the project's own instructions — remove the stale
   guidance rather than appending contradictory new guidance next to it.
7. **Remove `react-native-unistyles`** (dependency, `src/theme/unistyles.ts`, `src/common/components/uni/`,
   any babel/metro plugin registration for it) only after steps 5–6 are complete and verified — removing
   it earlier breaks every still-unmigrated component.
8. Run `audit-app` at the end of this section specifically, before touching any feature code, so the
   cutover itself is verified clean first.

## 1. Reuse before you build

Before creating anything new:

- A common component in `src/common/components/` that already does this? Use it.
- A utility in `src/utils/` that already does this? Use it.
- A constant already defined in `src/constants/` or the relevant feature's `constants/`? Use it.

Only create new common infrastructure when nothing existing fits — and when you do, put it where the
next feature can find it (see sections 5–6), not buried inside one feature module.

## 2. Component pattern (NativeWind)

```
Component/
├── Component.tsx          # className-based JSX, variants via tailwind-variants
├── Component.variants.ts  # tailwind-variants config (replaces *.styles.ts)
├── Component.types.ts     # Props interface: `{ComponentName}Props`
└── index.ts                # barrel export — import from here, never the impl file
```

- Compose classes with a `cn()` helper (create `src/utils/cn.ts` once, wrapping `clsx` +
  `tailwind-merge`, if it doesn't exist yet) — never string-concatenate `className`.
- Every color/spacing/radius/font-size comes from the mapped design tokens (`bg-background-surface`,
  `text-text-secondary`, `p-4` only if `4` matches the ported spacing scale, etc.) — no literal hex in
  `className`, no arbitrary-value classes (`bg-[#123456]`) except as a last resort with a comment
  explaining why no token fits.
- `dark:` variants for anything that isn't already token-driven via CSS variables.
- Accessibility props stay mandatory regardless of styling system: `accessibilityRole`,
  `accessibilityLabel`, `accessibilityState` on every interactive element.
- Named exports in `src/`, default exports only for `app/` route files.

## 3. Feature module pattern

Follow `create-feature`'s directory shape (types, service, hooks, store, schema, constants,
components) — that scaffolding is styling-agnostic and still correct. Enforce strictly:

- **Service layer separation**: no `fetch`/`axios` calls inside a component or a bare hook. All
  network access goes through `src/services/api`'s configured client, wrapped by a feature
  `xxxService.ts`, called only from React Query hooks (`useXxxQuery`/`useXxxMutation`).
- **Query key factories**, not inline arrays, for cache keys.
- **Zustand only for client-only state** (selectors always: `useStore((s) => s.field)`, never a bare
  `useStore()` call) — server data belongs in React Query, not a store.

## 4. Secrets & environment

- Any new API key, base URL, or credential is a new `EXPO_PUBLIC_*` (or server-only, non-public) var:
  add a placeholder to `.env.example`, read it through `src/config/env.ts` (which validates presence/
  shape), never `process.env.X` scattered elsewhere in the codebase.
- Never write a real secret value into a committed file, a `SKILL.md`, a comment, or a log statement.
- If a new kind of local secret file gets introduced (a service-account JSON, a keystore, etc.),
  add its pattern to `.gitignore` in the same change — don't rely on someone remembering later.
- Before finishing, run `git status`/`git diff` on `.env*` and confirm nothing but `.env.example`
  is staged.

## 5. Theming (dark/light + presets)

- Never hardcode a color; always go through the mapped tokens from section 0.
- If the app has theme presets (not just light/dark — check `src/theme/config.ts`), any new screen
  must look correct across presets, not just the default one — spot-check at least one non-default
  preset in both modes for new screens with distinctive branding (headers, illustrations, empty
  states).
- Respect the existing "system vs. manual override" behavior in `themeManager.ts` — don't introduce a
  second, competing way to read/set theme.

## 6. Internationalization

- Every user-facing string goes through `useTranslation()` / `t('key')` — no hardcoded UI text, no
  hardcoded validation messages in Zod schemas (use i18n keys there too).
- Use the `add-translations` skill (or its steps) to add matching keys to **both** `en.json` and
  `ar.json` in the same change — never ship an English-only key.
- Check RTL: any new layout using directional values (`marginLeft`, `left`, hardcoded row direction)
  should use logical/RTL-aware alternatives instead.

## 7. Shared constants

- App-wide constants (values used by 2+ features, or fundamental to the app: pagination defaults,
  regex patterns, external links, global enums) live in `src/constants/` with a barrel `index.ts`.
  Create this directory the first time it's needed if it doesn't exist yet.
- Constants used by exactly one feature stay in that feature's own `constants/` folder — don't
  pre-emptively promote something to shared before a second consumer exists.
- Never duplicate a constant across features — if you find yourself typing the same literal in a
  second feature, promote it to `src/constants/` instead and update both call sites.

## 8. Shared utility functions

- Generic, pure, cross-feature logic (formatting, date/number helpers, string helpers, the `cn()`
  className merger, array/object helpers) lives in `src/utils/`, not duplicated per feature.
- Before writing a new helper, check `src/utils/` (and `src/theme/metrics.ts` for
  sizing/responsive helpers, `src/utils/storage/` for persistence) for something that already does
  it.
- If you find near-duplicate logic already inline in two or more features while working, promote it
  to `src/utils/` as a fix-forward, don't just add a third copy.

## 9. Gap checklist (run at the start of every invocation)

Before writing feature code, check for and fill these commonly-missing pieces if this feature touches
them:

- [ ] `src/constants/index.ts` exists (create if this feature needs shared constants and it's missing)
- [ ] `src/utils/cn.ts` exists once NativeWind is set up (create if missing and this feature adds UI)
- [ ] Every `EXPO_PUBLIC_*` used by new code has a matching entry in `.env.example` and is validated
      in `src/config/env.ts`
- [ ] Every new i18n key used in code exists in **both** `en.json` and `ar.json`
- [ ] Every new component/module has a barrel `index.ts`
- [ ] No leftover `react-native-unistyles` imports in files you touched (flag and migrate them if
      found, don't add NativeWind styling next to unmigrated unistyles styling in the same file)

## 10. Finish every change with a validation pass

Run (or hand off to) `audit-app` after implementation, not just at the very end of a large plan — catch
breakage per feature/module, not after everything has piled up.

## Critical rules

- Never suppress a type or lint error (`@ts-ignore`, `eslint-disable`, `any`) — fix the real issue.
  This is also hook-enforced, but don't attempt workarounds like disabling the hook.
- Never introduce a second styling system alongside NativeWind "just for this one component."
- Never call a backend/service directly from a component — always through the service layer.
- Never leave a feature half-wired (screen with no route, mutation with no error state, key added to
  one locale file only).
