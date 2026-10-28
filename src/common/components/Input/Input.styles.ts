import { StyleSheet, type UnistylesVariants } from 'react-native-unistyles';
import { hs, rf, vs } from '@/theme/metrics';

// Field metrics match the prototype's shared input rule: 1px border, 10px radius,
// 9/11 padding, 13.5px text. Select and SearchBar repeat the same numbers.
export const styles = StyleSheet.create((theme) => ({
  wrapper: {
    gap: vs(5),
  },
  label: {
    color: theme.colors.text.secondary,
  },
  inputContainer: {
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
      error: {
        true: {
          borderColor: theme.colors.state.error,
        },
      },
      disabled: {
        true: {
          opacity: 0.5,
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
      disabled: {
        true: {
          color: theme.colors.text.muted,
        },
      },
    },
  },
  errorText: {
    color: theme.colors.state.error,
  },
  helperText: {
    color: theme.colors.text.muted,
  },
}));

export type InputStyleVariants = UnistylesVariants<typeof styles>;
