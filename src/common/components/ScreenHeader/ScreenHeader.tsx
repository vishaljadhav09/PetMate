import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { IconButton } from '@/common/components/IconButton';
import { Text } from '@/common/components/Text';
import { styles } from './ScreenHeader.styles';
import type { ScreenHeaderProps } from './ScreenHeader.types';

/**
 * Standard screen heading. Without `onBack` it is the large title used at the
 * top of tab screens; with `onBack` it is the compact back-button row used on
 * pushed screens (detail, forms).
 *
 * @example
 * ```tsx
 * <ScreenHeader title={t('discover.title')} subtitle={t('discover.subtitle')} />
 * <ScreenHeader title={pet.name} onBack={router.back} right={<Menu ... />} />
 * ```
 */
export function ScreenHeader({ title, subtitle, onBack, right }: ScreenHeaderProps) {
  const { t } = useTranslation();

  if (onBack) {
    return (
      <View style={styles.back}>
        <View style={styles.backLeft}>
          <IconButton
            icon="chevron-back"
            accessibilityLabel={t('common.back')}
            variant="ghost"
            onPress={onBack}
          />
          <Text variant="h2" numberOfLines={1} style={styles.backTitle} accessibilityRole="header">
            {title}
          </Text>
        </View>
        {right}
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Text variant="h1" accessibilityRole="header">
        {title}
      </Text>
      {!!subtitle && (
        <Text variant="body" color="secondary">
          {subtitle}
        </Text>
      )}
    </View>
  );
}
