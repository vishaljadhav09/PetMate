/**
 * Translates an i18n key that TypeScript only knows as a plain `string` (e.g.
 * a validation message key coming from a Zod schema attached to a
 * dynamically-typed form field), where it can't statically narrow the value
 * to the strict literal key union `t()` otherwise requires. Accepts any
 * `t`-shaped function so it works with whatever specific key union the
 * caller's `useTranslation()` resolves to.
 */
export function translateDynamicKey(t: (key: never) => string, key: string): string {
  return t(key as never);
}
