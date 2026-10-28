import { Text, View } from 'react-native';
import { styles } from './Tag.styles';
import type { TagProps } from './Tag.types';

/**
 * Small, non-interactive colored label for statuses and facts (verified,
 * vaccinated, request status). For a selectable filter use `Chip`; for a
 * numeric count use `Badge`.
 *
 * @example
 * ```tsx
 * <Tag label="Verified" tone="success" />
 * ```
 */
export function Tag({ label, tone = 'neutral' }: TagProps) {
  styles.useVariants({ tone });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}
