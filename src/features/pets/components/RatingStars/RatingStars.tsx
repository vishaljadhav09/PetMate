import { Pressable, Text, View } from 'react-native';
import { styles } from './RatingStars.styles';

export interface RatingStarsProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
}

const STAR_VALUES = [1, 2, 3, 4, 5] as const;
const STAR_GLYPH = '★';

/** Interactive when `onChange` is given, a read-only display otherwise. */
export function RatingStars({ value, onChange, size = 22 }: RatingStarsProps) {
  return (
    <View style={styles.row}>
      {STAR_VALUES.map((starValue) => {
        const star = (
          <Text
            style={[
              styles.star,
              styles.size(size),
              starValue <= Math.round(value) && styles.filled,
            ]}
          >
            {STAR_GLYPH}
          </Text>
        );

        if (!onChange) return <View key={starValue}>{star}</View>;

        return (
          <Pressable
            key={starValue}
            onPress={() => onChange(starValue)}
            accessibilityRole="button"
            accessibilityLabel={`${starValue}`}
          >
            {star}
          </Pressable>
        );
      })}
    </View>
  );
}
