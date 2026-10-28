import { StyleSheet, type UnistylesVariants } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    alignSelf: 'flex-start' as const,
    borderRadius: theme.metrics.borderRadius.full,
    paddingHorizontal: theme.metrics.spacing.p8,
    paddingVertical: theme.metrics.spacingV.p4,
    variants: {
      tone: {
        neutral: {
          backgroundColor: theme.colors.background.surfaceAlt,
          borderWidth: 1,
          borderColor: theme.colors.border.default,
        },
        success: { backgroundColor: theme.colors.state.successBg },
        warning: { backgroundColor: theme.colors.state.warningBg },
        error: { backgroundColor: theme.colors.state.errorBg },
        info: { backgroundColor: theme.colors.state.infoBg },
      },
    },
  },
  label: {
    fontFamily: theme.fonts.semiBold,
    fontSize: theme.fonts.size.xs,
    variants: {
      tone: {
        neutral: { color: theme.colors.text.secondary },
        success: { color: theme.colors.state.success },
        warning: { color: theme.colors.state.warning },
        error: { color: theme.colors.state.error },
        info: { color: theme.colors.state.info },
      },
    },
  },
}));

export type TagStyleVariants = UnistylesVariants<typeof styles>;
