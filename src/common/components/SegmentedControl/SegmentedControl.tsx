import { useCallback, useState } from 'react';
import { Pressable, Text, View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  cancelAnimation,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { useUnistyles } from 'react-native-unistyles';
import { SEGMENT_PADDING, styles } from './SegmentedControl.styles';
import type { SegmentedControlProps, SegmentOption } from './SegmentedControl.types';

/**
 * Tabbed segmented control with an animated sliding indicator.
 *
 * @example
 * ```tsx
 * <SegmentedControl
 *   value={selected}
 *   onChange={setSelected}
 *   options={[
 *     { label: 'Day', value: 'day' },
 *     { label: 'Week', value: 'week' },
 *   ]}
 * />
 * ```
 */
export function SegmentedControl({
  value,
  onChange,
  options,
  size = 'md',
  disabled = false,
}: SegmentedControlProps) {
  const selectedIndex = options.findIndex((o) => o.value === value);
  const indicatorPosition = useSharedValue(selectedIndex >= 0 ? selectedIndex : 0);
  const [containerWidth, setContainerWidth] = useState(0);
  const { theme } = useUnistyles();

  styles.useVariants({ size, disabled });

  const handleSelect = (optionValue: string, index: number) => {
    if (disabled) return;
    cancelAnimation(indicatorPosition);
    indicatorPosition.value = withTiming(index, { duration: 200 });
    onChange(optionValue);
  };

  const segmentWidth =
    containerWidth > 0 ? (containerWidth - SEGMENT_PADDING * 2) / options.length : 0;

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorPosition.value * segmentWidth }],
    width: segmentWidth,
    opacity: containerWidth > 0 ? 1 : 0,
  }));

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  }, []);

  return (
    <View style={styles.container} accessibilityRole="tablist" onLayout={handleLayout}>
      <Animated.View style={[styles.indicator, indicatorStyle]} />
      {options.map((option, index) => {
        const isSelected = option.value === value;
        return (
          <SegmentItem
            key={option.value}
            option={option}
            index={index}
            isSelected={isSelected}
            disabled={disabled}
            indicatorPosition={indicatorPosition}
            activeColor={theme.colors.text.primary}
            inactiveColor={theme.colors.text.secondary}
            onPress={() => handleSelect(option.value, index)}
          />
        );
      })}
    </View>
  );
}

function SegmentItem({
  option,
  index,
  isSelected,
  disabled,
  indicatorPosition,
  activeColor,
  inactiveColor,
  onPress,
}: {
  option: SegmentOption;
  index: number;
  isSelected: boolean;
  disabled: boolean;
  indicatorPosition: SharedValue<number>;
  activeColor: string;
  inactiveColor: string;
  onPress: () => void;
}) {
  const textColorStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      indicatorPosition.value,
      [index - 1, index, index + 1],
      [inactiveColor, activeColor, inactiveColor]
    );
    return { color };
  });

  return (
    <View style={styles.segment}>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="tab"
        accessibilityState={{ selected: isSelected }}
      >
        <View style={styles.segmentContent}>
          {option.icon && <View style={styles.segmentIcon}>{option.icon}</View>}
          <Animated.Text style={[styles.segmentText, textColorStyle]}>{option.label}</Animated.Text>
          {option.count !== undefined && <Text style={styles.count}>{option.count}</Text>}
        </View>
      </Pressable>
    </View>
  );
}
