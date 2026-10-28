import { StyleSheet, type UnistylesVariants } from 'react-native-unistyles';
import { hs, rf, vs } from '@/theme/metrics';

// Sizes, radii and colors follow the prototype's .btn / .btn-small rules.
export const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: hs(6),
    variants: {
      variant: {
        primary: {
          backgroundColor: theme.colors.brand.secondary,
        },
        accept: {
          backgroundColor: theme.colors.brand.primary,
        },
        decline: {
          backgroundColor: theme.colors.state.errorBg,
        },
        // Prototype's .btn-ghost: a white button with a hairline border.
        secondary: {
          backgroundColor: theme.colors.background.surface,
          borderWidth: 1,
          borderColor: theme.colors.border.default,
        },
        outline: {
          backgroundColor: theme.colors.background.surface,
          borderWidth: 1,
          borderColor: theme.colors.border.default,
        },
        ghost: {
          backgroundColor: 'transparent',
        },
      },
      size: {
        sm: {
          paddingHorizontal: hs(12),
          paddingVertical: vs(8),
          borderRadius: hs(9),
        },
        md: {
          paddingHorizontal: hs(16),
          paddingVertical: vs(11),
          borderRadius: hs(11),
        },
        lg: {
          paddingHorizontal: hs(20),
          paddingVertical: vs(14),
          borderRadius: hs(11),
        },
      },
      fullWidth: {
        true: {
          width: '100%',
        },
      },
      disabled: {
        true: {
          opacity: 0.5,
        },
      },
    },
    compoundVariants: [
      // A disabled primary button turns flat grey instead of fading.
      {
        variant: 'primary',
        disabled: true,
        styles: {
          backgroundColor: theme.colors.text.muted,
          opacity: 1,
        },
      },
    ],
  },
  label: {
    fontFamily: theme.fonts.semiBold,
    variants: {
      variant: {
        primary: {
          color: theme.colors.text.inverse,
        },
        accept: {
          color: theme.colors.text.inverse,
        },
        decline: {
          color: theme.colors.state.error,
        },
        secondary: {
          color: theme.colors.text.primary,
        },
        outline: {
          color: theme.colors.text.primary,
        },
        ghost: {
          color: theme.colors.brand.primary,
        },
      },
      size: {
        sm: {
          fontSize: rf(12.5),
        },
        md: {
          fontSize: rf(13.5),
        },
        lg: {
          fontSize: rf(15),
        },
      },
    },
  },
}));

export type ButtonStyleVariants = UnistylesVariants<typeof styles>;
