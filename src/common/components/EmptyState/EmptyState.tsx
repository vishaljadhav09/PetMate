import { Text as RNText, View } from 'react-native';
import { Button } from '@/common/components/Button';
import { Text } from '@/common/components/Text';
import { styles } from './EmptyState.styles';
import type { EmptyStateProps } from './EmptyState.types';

/**
 * A placeholder view displayed when a list or section has no content.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   glyph="🔍"
 *   title="No results"
 *   message="Try a different search term."
 *   actionLabel="Clear filters"
 *   onAction={handleClear}
 * />
 * ```
 */
export function EmptyState({
  title,
  message,
  glyph,
  icon,
  actionLabel,
  onAction,
  size = 'md',
}: EmptyStateProps) {
  styles.useVariants({ size });

  return (
    <View style={styles.container} accessibilityRole="alert">
      {!!glyph && <RNText style={styles.glyph}>{glyph}</RNText>}
      {!glyph && icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
      {actionLabel && onAction && (
        <View style={styles.action}>
          <Button title={actionLabel} fullWidth onPress={onAction} />
        </View>
      )}
    </View>
  );
}
