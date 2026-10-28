import { StyleSheet } from 'react-native-unistyles';
import { hs, rf } from '@/theme/metrics';

// .fab in the prototype: a 52px marigold rounded square with a forest "+".
export const styles = StyleSheet.create((theme) => ({
  anchor: (bottom: number) => ({
    position: 'absolute' as const,
    right: hs(18),
    bottom,
  }),
  button: {
    width: hs(52),
    height: hs(52),
    borderRadius: hs(16),
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: theme.colors.brand.tertiary,
    shadowColor: theme.colors.shadow.color,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: theme.colors.shadow.elevationLarge,
  },
  glyph: {
    fontSize: rf(24),
    lineHeight: rf(28),
    color: theme.colors.brand.secondary,
  },
}));
