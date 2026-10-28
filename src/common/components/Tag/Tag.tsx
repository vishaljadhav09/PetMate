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
 * <Tag label="Vaccinated" tone="success" />
 * <Tag label="✓ Verified" tone="success" size="badge" />
 * <Tag label="Accepted" tone="success" size="status" />
 * ```
 */
export function Tag({ label, tone = 'neutral', size = 'tag' }: TagProps) {
  styles.useVariants({ tone, size });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}
