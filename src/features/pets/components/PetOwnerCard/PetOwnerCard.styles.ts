import { StyleSheet } from 'react-native-unistyles';
import { hs, rf, vs } from '@/theme/metrics';

// .owner-row in the prototype.
export const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: hs(10),
    marginVertical: vs(14),
    padding: hs(11),
    backgroundColor: theme.colors.background.surface,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    borderRadius: hs(13),
  },
  info: {
    flex: 1,
  },
  name: {
    fontFamily: theme.fonts.semiBold,
    fontSize: rf(13.5),
  },
  verifiedMark: {
    fontFamily: theme.fonts.regular,
    fontSize: rf(11),
    color: theme.colors.brand.primary,
  },
  rating: {
    marginTop: vs(1),
    fontSize: rf(12),
    color: theme.colors.text.secondary,
  },
}));
