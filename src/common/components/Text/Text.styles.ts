import { StyleSheet, type UnistylesVariants } from 'react-native-unistyles';
import { hs } from '@/theme/metrics';

export const styles = StyleSheet.create((theme) => ({
  text: {
    color: theme.colors.text.primary,
    fontFamily: theme.fonts.regular,
    variants: {
      variant: {
        // Headings use the display serif (Fraunces); the rest use Work Sans.
        h1: {
          fontFamily: theme.fonts.displayBold,
          fontSize: theme.fonts.size['3xl'],
          letterSpacing: -0.3,
        },
        h2: {
          fontFamily: theme.fonts.displayBold,
          fontSize: theme.fonts.size['2xl'],
          letterSpacing: -0.2,
        },
        h3: {
          fontFamily: theme.fonts.display,
          fontSize: theme.fonts.size.xl,
          letterSpacing: -0.1,
        },
        // Card/list-item title in the display serif (pet names, section titles).
        title: {
          fontFamily: theme.fonts.display,
          fontSize: theme.fonts.size.lg,
        },
        body: {
          fontFamily: theme.fonts.regular,
          fontSize: theme.fonts.size.md,
        },
        bodySmall: {
          fontFamily: theme.fonts.regular,
          fontSize: theme.fonts.size.sm,
        },
        caption: {
          fontFamily: theme.fonts.regular,
          fontSize: theme.fonts.size.xs,
        },
        label: {
          fontFamily: theme.fonts.semiBold,
          fontSize: theme.fonts.size.sm,
        },
        overline: {
          fontFamily: theme.fonts.semiBold,
          fontSize: theme.fonts.size.xxs,
          textTransform: 'uppercase',
          letterSpacing: hs(1),
        },
      },
      // Applies a Work Sans weight. Not meant for h1-h3, which keep the display font.
      weight: {
        regular: { fontFamily: theme.fonts.regular },
        medium: { fontFamily: theme.fonts.medium },
        semibold: { fontFamily: theme.fonts.semiBold },
        bold: { fontFamily: theme.fonts.bold },
      },
      align: {
        left: { textAlign: 'left' },
        center: { textAlign: 'center' },
        right: { textAlign: 'right' },
      },
      color: {
        primary: { color: theme.colors.text.primary },
        secondary: { color: theme.colors.text.secondary },
        tertiary: { color: theme.colors.text.tertiary },
        muted: { color: theme.colors.text.muted },
        inverse: { color: theme.colors.text.inverse },
        accent: { color: theme.colors.text.accent },
        link: { color: theme.colors.text.link },
      },
    },
  },
}));

export type TextStyleVariants = UnistylesVariants<typeof styles>;
