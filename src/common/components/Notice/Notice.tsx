import { View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';
import { Icon } from '@/common/components/Icon';
import { Text } from '@/common/components/Text';
import { styles } from './Notice.styles';
import type { NoticeProps, NoticeTone } from './Notice.types';

const DEFAULT_ICONS: Record<NoticeTone, NonNullable<NoticeProps['icon']>> = {
  info: 'information-circle-outline',
  success: 'checkmark-circle-outline',
  warning: 'alert-circle-outline',
  error: 'warning-outline',
};

/**
 * Inline banner for a short explanation or warning that belongs to a screen
 * section (e.g. "this pet is not yet breeding age"). For transient feedback use
 * `Snackbar`/toast instead.
 *
 * @example
 * ```tsx
 * <Notice tone="warning" message="Requests are disabled until this pet is old enough." />
 * ```
 */
export function Notice({ message, tone = 'info', icon }: NoticeProps) {
  const { theme } = useUnistyles();
  styles.useVariants({ tone });

  return (
    <View style={styles.container} accessibilityRole="alert">
      <Icon name={icon ?? DEFAULT_ICONS[tone]} sizeVariant="lg" color={theme.colors.state[tone]} />
      <Text variant="bodySmall" style={styles.message}>
        {message}
      </Text>
    </View>
  );
}
