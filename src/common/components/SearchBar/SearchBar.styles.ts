import { StyleSheet, type UnistylesVariants } from 'react-native-unistyles';
import { hs, rf, vs } from '@/theme/metrics';

// Looks exactly like a text input (the prototype's breed search has no icon).
export const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: theme.colors.background.input,
    borderRadius: hs(10),
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    gap: hs(8),
    variants: {
      size: {
        sm: {
          paddingHorizontal: hs(9),
        },
        md: {
          paddingHorizontal: hs(11),
        },
        lg: {
          paddingHorizontal: hs(14),
        },
      },
      focused: {
        true: {
          borderColor: theme.colors.border.focus,
        },
      },
    },
  },
  input: {
    flex: 1,
    color: theme.colors.text.primary,
    fontFamily: theme.fonts.regular,
    variants: {
      size: {
        sm: {
          paddingVertical: vs(7),
          fontSize: rf(12.5),
        },
        md: {
          paddingVertical: vs(9),
          fontSize: rf(13.5),
        },
        lg: {
          paddingVertical: vs(12),
          fontSize: rf(15),
        },
      },
    },
  },
}));

export type SearchBarStyleVariants = UnistylesVariants<typeof styles>;
