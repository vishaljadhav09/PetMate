import { StyleSheet } from 'react-native-unistyles';
import { hs, rf, vs } from '@/theme/metrics';

// A flush bottom bar with a hairline top border and emoji glyphs, as in the prototype's .tabbar.
export const styles = StyleSheet.create((theme) => ({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: theme.colors.background.tabBar,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.default,
    paddingTop: vs(8),
    paddingHorizontal: hs(6),
  },
  tabCell: {
    flex: 1,
  },
  tab: {
    alignItems: 'center',
    gap: vs(4),
    paddingVertical: vs(6),
    paddingHorizontal: hs(2),
    borderRadius: hs(12),
  },
  glyph: {
    fontSize: rf(19),
    lineHeight: rf(19),
  },
  label: {
    fontSize: rf(11),
    fontFamily: theme.fonts.regular,
  },
  labelActive: {
    color: theme.colors.brand.secondary,
  },
  labelInactive: {
    color: theme.colors.text.muted,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: '22%',
    minWidth: hs(15),
    height: hs(15),
    borderRadius: hs(8),
    paddingHorizontal: hs(3),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.state.error,
    zIndex: 2,
  },
  badgeText: {
    fontSize: rf(9.5),
    fontFamily: theme.fonts.bold,
    color: theme.colors.text.inverse,
  },
}));
