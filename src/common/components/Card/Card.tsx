import { View, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { useAnimatedPress } from '@/hooks/useAnimatedPress';
import { styles } from './Card.styles';
import type { CardProps } from './Card.types';

/**
 * Container component with filled, elevated, or outlined variants and optional press support.
 *
 * @example
 * ```tsx
 * <Card variant="elevated">
 *   <Text>Card content</Text>
 * </Card>
 * <Card pressable onPress={handlePress} variant="outlined">
 *   <Text>Pressable card</Text>
 * </Card>
 * ```
 */
export function Card({
  variant = 'filled',
  pressable = false,
  onPress,
  children,
  style,
  ...rest
}: CardProps) {
  styles.useVariants({ variant });

  if (pressable && onPress) {
    return (
      <PressableCard onPress={onPress} style={style} {...rest}>
        {children}
      </PressableCard>
    );
  }

  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  );
}

function PressableCard({
  onPress,
  children,
  style,
  ...rest
}: {
  onPress: () => void;
  children: React.ReactNode;
  style?: CardProps['style'];
} & Omit<CardProps, 'variant' | 'pressable' | 'onPress' | 'children'>) {
  const { animatedStyle, onPressIn, onPressOut } = useAnimatedPress({ scale: 0.98 });

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        accessibilityRole="button"
        {...rest}
      >
        <View style={[styles.card, style]}>{children}</View>
      </Pressable>
    </Animated.View>
  );
}
