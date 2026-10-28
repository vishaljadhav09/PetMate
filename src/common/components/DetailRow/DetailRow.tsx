import { View } from 'react-native';
import { Text } from '@/common/components/Text';
import { styles } from './DetailRow.styles';
import type { DetailRowProps } from './DetailRow.types';

/**
 * A label on the left and its value on the right (e.g. "Vaccinations — Up to date").
 * Stack several inside a `Card` and set `divider` on all but the last.
 *
 * @example
 * ```tsx
 * <Card variant="surface">
 *   <DetailRow label="Vaccinations" value="Up to date" divider />
 *   <DetailRow label="Pedigree" value="Certified" />
 * </Card>
 * ```
 */
export function DetailRow({ label, value, divider = false }: DetailRowProps) {
  styles.useVariants({ divider });

  return (
    <View style={styles.row}>
      <Text variant="bodySmall" color="secondary" style={styles.label}>
        {label}
      </Text>
      <Text variant="bodySmall" weight="semibold" align="right" style={styles.value}>
        {value}
      </Text>
    </View>
  );
}
