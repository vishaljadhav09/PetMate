import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Text } from '@/common/components/Text';
import { styles, SWITCH_THUMB_TRAVEL } from './Switch.styles';
import type { SwitchProps } from './Switch.types';

const THUMB_DURATION_MS = 150;

/**
 * Toggle switch with optional label and description, drawn to the prototype's
 * 40x23 track rather than the platform's native switch.
 *
 * @example
 * ```tsx
 * <Switch value={isEnabled} onValueChange={setIsEnabled} label="Notifications" />
 * ```
 */
export function Switch({
  value,
  onValueChange,
  disabled = false,
  size = 'md',
  label,
  description,
}: SwitchProps) {
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, { duration: THUMB_DURATION_MS });
  }, [value, progress]);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * SWITCH_THUMB_TRAVEL }],
  }));

  styles.useVariants({ size, disabled, on: value });

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelBlock}>
          <Text variant="body" style={styles.label}>
            {label}
          </Text>
          {!!description && (
            <Text variant="caption" style={styles.description}>
              {description}
            </Text>
          )}
        </View>
      )}
      <View style={styles.switchWrapper}>
        <Pressable
          onPress={() => onValueChange(!value)}
          disabled={disabled}
          accessibilityRole="switch"
          accessibilityLabel={label}
          accessibilityState={{ checked: value, disabled }}
          hitSlop={8}
        >
          <View style={styles.track}>
            <Animated.View style={[styles.thumb, thumbStyle]} />
          </View>
        </Pressable>
      </View>
    </View>
  );
}
