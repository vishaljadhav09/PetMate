import { Pressable, Text, View } from 'react-native';
import { useBottomPadding } from '@/hooks/useBottomPadding';
import { vs } from '@/theme/metrics';
import { styles } from './FloatingActionButton.styles';
import type { FloatingActionButtonProps } from './FloatingActionButton.types';

/** Gap between the tab bar clearance and the button. */
const ABOVE_TAB_BAR = vs(6);
const PLUS_GLYPH = '+';

/**
 * Round-cornered "+" button pinned above the tab bar, for the one primary
 * "add" action of a tab screen.
 *
 * @example
 * ```tsx
 * <FloatingActionButton accessibilityLabel="Add pet" onPress={addPet} />
 * ```
 */
export function FloatingActionButton({ onPress, accessibilityLabel }: FloatingActionButtonProps) {
  const bottom = useBottomPadding() + ABOVE_TAB_BAR;

  return (
    <View style={styles.anchor(bottom)}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
      >
        <View style={styles.button}>
          <Text style={styles.glyph}>{PLUS_GLYPH}</Text>
        </View>
      </Pressable>
    </View>
  );
}
