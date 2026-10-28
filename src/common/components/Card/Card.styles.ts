import { StyleSheet, type UnistylesVariants } from 'react-native-unistyles';
import { hs } from '@/theme/metrics';

export const styles = StyleSheet.create((theme) => ({
  card: {
    // 14px padding and 16px radius, as in the prototype's .card.
    borderRadius: hs(16),
    padding: hs(14),
    variants: {
      variant: {
        filled: {
          backgroundColor: theme.colors.background.surface,
        },
        elevated: {
          backgroundColor: theme.colors.background.elevated,
          elevation: theme.colors.shadow.elevationMedium,
          shadowColor: theme.colors.shadow.color,
          shadowOffset: { width: 0, height: hs(2) },
          shadowOpacity: 0.1,
          shadowRadius: hs(8),
        },
        outlined: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.border.default,
        },
        surface: {
          backgroundColor: theme.colors.background.surface,
          borderWidth: 1,
          borderColor: theme.colors.border.default,
        },
      },
    },
  },
}));

export type CardStyleVariants = UnistylesVariants<typeof styles>;
