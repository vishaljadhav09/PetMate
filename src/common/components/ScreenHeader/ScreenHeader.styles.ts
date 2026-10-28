import { StyleSheet, type UnistylesVariants } from 'react-native-unistyles';
import { hs, rf, vs } from '@/theme/metrics';

export const styles = StyleSheet.create((theme) => ({
  root: {
    paddingTop: vs(4),
    variants: {
      hasSubtitle: {
        true: { paddingBottom: vs(18) },
        false: { paddingBottom: vs(10) },
      },
    },
  },
  // .section-title: 22px display serif in the deep forest green.
  title: {
    color: theme.colors.brand.secondary,
    marginBottom: vs(4),
  },
  // .section-sub
  subtitle: {
    fontSize: rf(13.5),
    lineHeight: rf(13.5 * 1.5),
    color: theme.colors.text.secondary,
  },
  // Pushed screens: back button, 18px title (.modal-title) and an end slot.
  back: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    gap: hs(8),
    paddingBottom: vs(14),
  },
  backLeft: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: hs(4),
  },
  backTitle: {
    flex: 1,
    fontSize: rf(18),
    color: theme.colors.text.primary,
  },
}));

export type ScreenHeaderStyleVariants = UnistylesVariants<typeof styles>;
