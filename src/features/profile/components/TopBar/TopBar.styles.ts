import { StyleSheet } from 'react-native-unistyles';
import { hs, rf, vs } from '@/theme/metrics';

// Mirrors the prototype's .topbar, .wordmark and .acct-switch.
export const styles = StyleSheet.create((theme, rt) => ({
  container: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingTop: rt.insets.top + vs(18),
    paddingBottom: vs(14),
    paddingHorizontal: hs(18),
    backgroundColor: theme.colors.background.app,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
  },
  wordmark: {
    flexDirection: 'row' as const,
    alignItems: 'baseline' as const,
  },
  wordmarkText: {
    fontFamily: theme.fonts.displayBold,
    fontSize: rf(21),
    color: theme.colors.brand.secondary,
  },
  wordmarkDot: {
    color: theme.colors.text.accent,
  },
  account: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: hs(8),
    paddingVertical: vs(5),
    paddingLeft: hs(5),
    paddingRight: hs(12),
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    backgroundColor: theme.colors.background.surface,
  },
  accountName: {
    fontSize: rf(13),
    color: theme.colors.text.primary,
  },
}));
