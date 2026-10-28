import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';
import { Card, SegmentedControl, Text } from '@/common/components';
import { isAppLanguage, LANGUAGES, setAppLanguage } from '@/i18n/language';

/** Lets the owner pick the app language (English, Marathi or Arabic). */
export function LanguageSelector() {
  const { t, i18n } = useTranslation();

  const handleChange = async (next: string) => {
    if (!isAppLanguage(next)) return;
    const needsRestart = await setAppLanguage(next);
    if (needsRestart) {
      Toast.show({ type: 'info', text1: t('profile.languageRestartNote') });
    }
  };

  return (
    <Card variant="surface">
      <View className="gap-3">
        <Text variant="title">{t('profile.languageTitle')}</Text>
        <SegmentedControl
          value={i18n.language}
          onChange={handleChange}
          options={LANGUAGES.map((language) => ({
            label: language.nativeName,
            value: language.code,
          }))}
        />
      </View>
    </Card>
  );
}
