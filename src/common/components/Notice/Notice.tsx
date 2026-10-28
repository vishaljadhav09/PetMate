import { Text as RNText, View } from 'react-native';
import { Text } from '@/common/components/Text';
import { styles } from './Notice.styles';
import type { NoticeProps, NoticeTone } from './Notice.types';

const DEFAULT_GLYPHS: Record<NoticeTone, string> = {
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
  error: '⚠️',
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
export function Notice({ message, tone = 'info', glyph }: NoticeProps) {
  styles.useVariants({ tone });

  return (
    <View style={styles.container} accessibilityRole="alert">
      <RNText style={styles.glyph}>{glyph ?? DEFAULT_GLYPHS[tone]}</RNText>
      <Text variant="bodySmall" style={styles.message}>
        {message}
      </Text>
    </View>
  );
}
