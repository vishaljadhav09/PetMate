import { StyleSheet, type UnistylesVariants } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    gap: theme.metrics.spacing.p8,
    padding: theme.metrics.spacing.p12,
    borderRadius: theme.metrics.borderRadius.lg,
    variants: {
      tone: {
        info: { backgroundColor: theme.colors.state.infoBg },
        success: { backgroundColor: theme.colors.state.successBg },
        warning: { backgroundColor: theme.colors.state.warningBg },
        error: { backgroundColor: theme.colors.state.errorBg },
      },
    },
  },
  message: {
    flex: 1,
    lineHeight: theme.fonts.size.sm * 1.5,
    variants: {
      tone: {
        info: { color: theme.colors.state.info },
        success: { color: theme.colors.state.success },
        warning: { color: theme.colors.state.warning },
        error: { color: theme.colors.state.error },
      },
    },
  },
}));

export type NoticeStyleVariants = UnistylesVariants<typeof styles>;
