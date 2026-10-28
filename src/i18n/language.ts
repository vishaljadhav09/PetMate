import { I18nManager, Platform } from 'react-native';
import { setItem, STORAGE_KEYS } from '@/utils/storage';
import i18n from './config';

export type AppLanguage = 'en' | 'mr' | 'ar';

/** Each language is named in its own script so people can find theirs whatever the current language. */
export const LANGUAGES: { code: AppLanguage; nativeName: string }[] = [
  { code: 'en', nativeName: 'English' },
  { code: 'mr', nativeName: 'मराठी' },
  { code: 'ar', nativeName: 'العربية' },
];

export function isAppLanguage(value: string): value is AppLanguage {
  return LANGUAGES.some((language) => language.code === value);
}

/**
 * Switches the UI language and remembers it for the next launch.
 *
 * @returns `true` when the text direction changed (English/Marathi are left-to-right,
 * Arabic is right-to-left). React Native only applies that after the app restarts.
 */
export async function setAppLanguage(language: AppLanguage): Promise<boolean> {
  const wasRtl = i18n.language === 'ar';
  const isRtl = language === 'ar';

  setItem(STORAGE_KEYS.preferences.language, language);
  await i18n.changeLanguage(language);

  if (Platform.OS === 'web' || wasRtl === isRtl) return false;

  I18nManager.allowRTL(isRtl);
  I18nManager.forceRTL(isRtl);
  return true;
}
