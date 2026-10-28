import { StyleSheet, type UnistylesVariants } from 'react-native-unistyles';
import { hs, rf, vs } from '@/theme/metrics';

// `tag` is the prototype's .tag (11px, hairline border), `badge` its bolder
// .verified-badge and `status` the .status-pill used on request cards.
export const styles = StyleSheet.create((theme) => ({
  container: {
    alignSelf: 'flex-start' as const,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    borderRadius: 999,
    variants: {
      size: {
        tag: {
          paddingHorizontal: hs(8),
          paddingVertical: vs(3),
          borderWidth: 1,
          borderColor: 'transparent',
        },
        badge: {
          paddingHorizontal: hs(7),
          paddingVertical: vs(2),
        },
        status: {
          paddingHorizontal: hs(9),
          paddingVertical: vs(3),
        },
      },
      tone: {
        neutral: {
          backgroundColor: theme.colors.background.surfaceAlt,
          borderColor: theme.colors.border.default,
        },
        success: { backgroundColor: theme.colors.state.successBg },
        warning: { backgroundColor: theme.colors.state.warningBg },
        error: { backgroundColor: theme.colors.state.errorBg },
        info: { backgroundColor: theme.colors.state.infoBg },
        muted: { backgroundColor: theme.colors.state.mutedBg },
      },
    },
  },
  label: {
    variants: {
      size: {
        tag: {
          fontFamily: theme.fonts.regular,
          fontSize: rf(11),
        },
        badge: {
          fontFamily: theme.fonts.bold,
          fontSize: rf(10),
        },
        status: {
          fontFamily: theme.fonts.bold,
          fontSize: rf(11),
        },
      },
      tone: {
        neutral: { color: theme.colors.text.secondary },
        success: { color: theme.colors.state.success },
        warning: { color: theme.colors.state.warning },
        error: { color: theme.colors.state.error },
        info: { color: theme.colors.state.info },
        muted: { color: theme.colors.text.muted },
      },
    },
  },
}));

export type TagStyleVariants = UnistylesVariants<typeof styles>;
