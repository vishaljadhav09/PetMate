import { StyleSheet, type UnistylesVariants } from 'react-native-unistyles';
import { hs, rf } from '@/theme/metrics';

export const styles = StyleSheet.create((theme) => ({
  text: {
    color: theme.colors.text.primary,
    fontFamily: theme.fonts.regular,
    variants: {
      variant: {
        // Headings use the display serif (Fraunces); the rest use Work Sans.
        // Sizes follow the prototype: h1 is its screen title, h2 the pet-detail name.
        h1: {
          fontFamily: theme.fonts.display,
          fontSize: rf(22),
          letterSpacing: -0.22,
        },
        h2: {
          fontFamily: theme.fonts.display,
          fontSize: rf(21),
          letterSpacing: -0.21,
        },
        h3: {
          fontFamily: theme.fonts.display,
          fontSize: rf(18),
          letterSpacing: -0.18,
        },
        // Card/list-item title in the display serif (pet names, section titles).
        title: {
          fontFamily: theme.fonts.display,
          fontSize: rf(16.5),
        },
        body: {
          fontFamily: theme.fonts.regular,
          fontSize: rf(13.5),
        },
        bodySmall: {
          fontFamily: theme.fonts.regular,
          fontSize: rf(12.5),
        },
        caption: {
          fontFamily: theme.fonts.regular,
          fontSize: rf(11.5),
        },
        label: {
          fontFamily: theme.fonts.medium,
          fontSize: rf(12),
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
