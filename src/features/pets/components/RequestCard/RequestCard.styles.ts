import { StyleSheet } from 'react-native-unistyles';
import { hs, rf, vs } from '@/theme/metrics';

// .req-top, .req-title, .req-sub, .req-msg and .req-contact in the prototype.
export const styles = StyleSheet.create((theme) => ({
  top: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    justifyContent: 'space-between' as const,
    gap: hs(10),
  },
  heading: {
    flex: 1,
  },
  title: {
    fontFamily: theme.fonts.display,
    fontSize: rf(15),
    color: theme.colors.text.primary,
  },
  titleNote: {
    fontFamily: theme.fonts.regular,
    fontSize: rf(12.5),
    color: theme.colors.text.secondary,
  },
  subtitle: {
    marginTop: vs(2),
    fontSize: rf(12),
    color: theme.colors.text.secondary,
  },
  warning: {
    marginTop: vs(8),
  },
  message: {
    marginTop: vs(8),
    paddingVertical: vs(9),
    paddingHorizontal: hs(10),
    borderRadius: hs(9),
    backgroundColor: theme.colors.background.surfaceAlt,
  },
  messageText: {
    fontSize: rf(13),
    lineHeight: rf(13 * 1.5),
    color: theme.colors.text.primary,
  },
  contact: {
    marginTop: vs(8),
    fontFamily: theme.fonts.semiBold,
    fontSize: rf(12.5),
    color: theme.colors.brand.primary,
  },
  note: {
    marginTop: vs(8),
    fontSize: rf(12.5),
    color: theme.colors.text.secondary,
  },
  actions: {
    flexDirection: 'row' as const,
    gap: hs(8),
    marginTop: vs(10),
  },
  action: {
    flex: 1,
  },
}));
