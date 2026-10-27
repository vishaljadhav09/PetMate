import { Pressable, View } from 'react-native';
import { Icon } from '@/common/components';

export interface RatingStarsProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
}

const STAR_VALUES = [1, 2, 3, 4, 5] as const;

/** Interactive when `onChange` is given, a read-only display otherwise. */
export function RatingStars({ value, onChange, size = 18 }: RatingStarsProps) {
  return (
    <View className="flex-row gap-1">
      {STAR_VALUES.map((starValue) => {
        const filled = starValue <= Math.round(value);
        const icon = filled ? 'star' : 'star-outline';
        const variant = filled ? 'accent' : 'muted';

        if (!onChange) {
          return <Icon key={starValue} name={icon} size={size} variant={variant} />;
        }

        return (
          <Pressable
            key={starValue}
            onPress={() => onChange(starValue)}
            accessibilityRole="button"
            accessibilityLabel={`${starValue}`}
          >
            <Icon name={icon} size={size} variant={variant} />
          </Pressable>
        );
      })}
    </View>
  );
}
