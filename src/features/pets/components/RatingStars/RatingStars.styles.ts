import { StyleSheet } from 'react-native-unistyles';
import { hs, vs } from '@/theme/metrics';

// .stars / .star in the prototype: 4px apart, marigold when filled, hairline-grey when empty.
export const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: 'row' as const,
    gap: hs(4),
    marginTop: vs(8),
    marginBottom: vs(4),
  },
  star: {
    color: theme.colors.border.default,
  },
  filled: {
    color: theme.colors.brand.tertiary,
  },
  size: (fontSize: number) => ({ fontSize }),
}));
