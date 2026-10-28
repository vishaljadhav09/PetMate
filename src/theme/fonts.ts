/**
 * Font families. Names must match the keys registered with `useFonts` in
 * `app/_layout.tsx` (they come from the @expo-google-fonts packages).
 *
 * React Native needs one family per weight, so weights are separate entries
 * rather than a `fontWeight` on a single family.
 *
 * - `display*` (Fraunces): headings and pet names
 * - `regular`..`bold` (Work Sans): everything else
 */
export const FONTS = {
  regular: 'WorkSans_400Regular',
  medium: 'WorkSans_500Medium',
  semiBold: 'WorkSans_600SemiBold',
  bold: 'WorkSans_700Bold',
  light: 'WorkSans_400Regular',
  displayRegular: 'Fraunces_400Regular',
  display: 'Fraunces_600SemiBold',
  displayBold: 'Fraunces_700Bold',
};
