import { StyleSheet, type UnistylesVariants } from 'react-native-unistyles';
import { hs, rf, vs } from '@/theme/metrics';

export const styles = StyleSheet.create((theme) => ({
  wrapper: {
    gap: vs(5),
  },
  label: {
    color: theme.colors.text.secondary,
  },
  trigger: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    gap: hs(8),
    backgroundColor: theme.colors.background.input,
    borderRadius: hs(10),
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    variants: {
      size: {
        sm: {
          paddingHorizontal: hs(9),
          paddingVertical: vs(7),
        },
        md: {
          paddingHorizontal: hs(11),
          paddingVertical: vs(9),
        },
        lg: {
          paddingHorizontal: hs(14),
          paddingVertical: vs(12),
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
  triggerText: {
    flex: 1,
    fontFamily: theme.fonts.regular,
    fontSize: rf(13.5),
  },
  selectedText: {
    color: theme.colors.text.primary,
  },
  placeholderText: {
    color: theme.colors.text.muted,
  },
  errorText: {
    color: theme.colors.state.error,
  },
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end' as const,
    backgroundColor: theme.colors.overlay.modal,
  },
  sheet: {
    width: '100%',
    maxWidth: theme.metrics.contentMaxWidth.narrow,
    maxHeight: '60%',
    alignSelf: 'center' as const,
    backgroundColor: theme.colors.background.modal,
    borderTopLeftRadius: hs(22),
    borderTopRightRadius: hs(22),
  },
  listContent: {
    paddingTop: vs(10),
    paddingBottom: vs(22),
  },
  option: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingVertical: vs(12),
    paddingHorizontal: hs(18),
    variants: {
      disabled: {
        true: {
          opacity: 0.5,
        },
      },
    },
  },
  optionText: {
    color: theme.colors.text.primary,
  },
  optionTextSelected: {
    color: theme.colors.brand.primary,
    fontFamily: theme.fonts.semiBold,
  },
}));

export type SelectStyleVariants = UnistylesVariants<typeof styles>;
