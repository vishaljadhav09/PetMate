import { StyleSheet, type UnistylesVariants } from 'react-native-unistyles';
import { hs, rf, vs } from '@/theme/metrics';

export const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: 'center' as const,
    variants: {
      size: {
        sm: {
          paddingTop: vs(24),
          paddingBottom: vs(16),
          paddingHorizontal: hs(20),
        },
        md: {
          paddingTop: vs(50),
          paddingBottom: vs(30),
          paddingHorizontal: hs(20),
        },
        lg: {
          paddingTop: vs(64),
          paddingBottom: vs(40),
          paddingHorizontal: hs(20),
        },
      },
    },
  },
  glyph: {
    fontSize: rf(34),
    marginBottom: vs(10),
  },
  iconContainer: {
    marginBottom: vs(10),
  },
  title: {
    fontFamily: theme.fonts.displayRegular,
    fontSize: rf(16),
    color: theme.colors.text.primary,
    marginBottom: vs(6),
    textAlign: 'center' as const,
  },
  message: {
    fontSize: rf(12.5),
    lineHeight: rf(12.5 * 1.5),
    color: theme.colors.text.secondary,
    textAlign: 'center' as const,
  },
  action: {
    alignSelf: 'stretch' as const,
    marginTop: vs(16),
  },
}));

export type EmptyStateStyleVariants = UnistylesVariants<typeof styles>;
