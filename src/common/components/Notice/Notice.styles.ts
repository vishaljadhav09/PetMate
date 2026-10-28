import { StyleSheet, type UnistylesVariants } from 'react-native-unistyles';
import { hs, rf, vs } from '@/theme/metrics';

// The prototype's .notice is marigold by default, so `info` shares the warning
// colors; only `error` (.notice.clay) and `success` differ.
export const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    gap: hs(9),
    paddingVertical: vs(11),
    paddingHorizontal: hs(12),
    borderRadius: hs(12),
    variants: {
      tone: {
        info: { backgroundColor: theme.colors.state.warningBg },
        success: { backgroundColor: theme.colors.state.successBg },
        warning: { backgroundColor: theme.colors.state.warningBg },
        error: { backgroundColor: theme.colors.state.errorBg },
      },
    },
  },
  glyph: {
    fontSize: rf(16),
    lineHeight: rf(16 * 1.3),
  },
  message: {
    flex: 1,
    fontSize: rf(12.5),
    lineHeight: rf(12.5 * 1.5),
    variants: {
      tone: {
        info: { color: theme.colors.state.warning },
        success: { color: theme.colors.state.success },
        warning: { color: theme.colors.state.warning },
        error: { color: theme.colors.state.error },
      },
    },
  },
}));

export type NoticeStyleVariants = UnistylesVariants<typeof styles>;
