interface ErrorLike {
  message?: string;
  code?: string;
}

function isErrorLike(error: unknown): error is ErrorLike {
  return typeof error === 'object' && error !== null;
}

/**
 * Turns any thrown value into text a user can read. Supabase errors are plain objects, not
 * `Error` instances. Database rule messages (raised with `raise exception`, code `P0001`) are
 * already readable, such as "Species must match", so they are shown as they are.
 *
 * `t` is the i18n function from `useTranslation()`; it is typed loosely here because the keys
 * used are fixed and known to exist.
 */
export function friendlyError(error: unknown, t: (key: never) => string): string {
  const translate = (key: string) => t(key as never);
  if (!isErrorLike(error)) return translate('errors.generic');

  if (error.code === '23505') return translate('errors.duplicate');
  if (error.code === '42501') return translate('errors.permission');
  if (error.code === 'PGRST301' || error.message?.includes('JWT')) {
    return translate('errors.sessionExpired');
  }
  if (error.code === 'P0001' && error.message) return error.message;
  if (error instanceof Error && error.message.includes('Network request failed')) {
    return translate('errors.network');
  }
  return translate('errors.generic');
}
