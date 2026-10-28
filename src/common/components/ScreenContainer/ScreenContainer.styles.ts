import { StyleSheet, type UnistylesVariants } from 'react-native-unistyles';
import { hs, vs } from '@/theme/metrics';

export const styles = StyleSheet.create((theme, rt) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.app,
  },
  // 18px side gutters on phones, as in the prototype's .screen.
  padded: {
    paddingHorizontal: {
      xs: hs(18),
      sm: hs(18),
      md: theme.metrics.spacing.p24,
      lg: theme.metrics.spacing.p32,
    },
  },
  edgeTop: {
    paddingTop: rt.insets.top,
  },
  edgeBottom: {
    paddingBottom: rt.insets.bottom + vs(22),
  },
  // Centers content and stops it stretching edge-to-edge on tablets/web.
  content: {
    width: '100%',
    alignSelf: 'center' as const,
    variants: {
      width: {
        narrow: { maxWidth: theme.metrics.contentMaxWidth.narrow },
        wide: { maxWidth: theme.metrics.contentMaxWidth.wide },
      },
      fill: {
        true: { flex: 1 },
      },
      padded: {
        true: { paddingTop: vs(16) },
      },
    },
  },
}));

export type ScreenContainerStyleVariants = UnistylesVariants<typeof styles>;
