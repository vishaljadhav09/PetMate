/**
 * NativeWind (Tailwind) config.
 *
 * Every color below mirrors a token in `src/theme/light-theme.ts` (base value)
 * and `src/theme/dark-theme.ts` (the `-dark` suffix). The two files must stay in
 * sync — `src/theme/__tests__/tailwindParity.test.ts` fails if they drift.
 *
 * Class name -> theme token:
 *   app           -> background.app          section   -> background.section
 *   surface       -> background.surface      border    -> border.default
 *   surface-alt   -> background.surfaceAlt   ink       -> text.primary
 *   ink-secondary -> text.secondary          ink-muted -> text.muted
 *   brand-*       -> brand.*                 state-*   -> state.*
 *
 * `darkMode: 'media'` follows the OS color scheme automatically for now. It is
 * NOT yet wired to this app's existing manual light/dark toggle
 * (`src/theme/themeManager.ts`, still unistyles-driven) — that reconciliation
 * belongs to the full NativeWind cutover described in the `build-feature` skill.
 */
module.exports = {
  darkMode: 'media',
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        app: { DEFAULT: '#FAF6EC', dark: '#14130F' },
        surface: { DEFAULT: '#FFFFFF', dark: '#1E1C17' },
        'surface-alt': { DEFAULT: '#F0EADA', dark: '#29261F' },
        section: { DEFAULT: '#E4ECE3', dark: '#1F2B22' },
        border: { DEFAULT: '#E4DCC8', dark: '#38342B' },
        brand: {
          primary: { DEFAULT: '#24402F', dark: '#8DB596' },
          secondary: { DEFAULT: '#16281C', dark: '#C5D8C8' },
          tertiary: { DEFAULT: '#E8A33D', dark: '#F0B55A' },
        },
        ink: { DEFAULT: '#221F1A', dark: '#F4EFE3' },
        'ink-secondary': { DEFAULT: '#6B6459', dark: '#C9C1B1' },
        'ink-muted': { DEFAULT: '#A79E8C', dark: '#7D7666' },
        state: {
          success: { DEFAULT: '#24402F', dark: '#8DB596' },
          'success-bg': { DEFAULT: '#E4ECE3', dark: 'rgba(141, 181, 150, 0.18)' },
          warning: { DEFAULT: '#B9791E', dark: '#F0B55A' },
          'warning-bg': { DEFAULT: '#FBEDD3', dark: 'rgba(240, 181, 90, 0.18)' },
          error: { DEFAULT: '#B24A2C', dark: '#E58A6B' },
          'error-bg': { DEFAULT: '#F5DFD4', dark: 'rgba(229, 138, 107, 0.18)' },
          info: { DEFAULT: '#3C5A46', dark: '#A9CBB1' },
          'info-bg': { DEFAULT: '#E4ECE3', dark: 'rgba(169, 203, 177, 0.16)' },
        },
      },
      fontFamily: {
        display: ['Fraunces_600SemiBold'],
        'display-bold': ['Fraunces_700Bold'],
        sans: ['WorkSans_400Regular'],
        'sans-medium': ['WorkSans_500Medium'],
        'sans-semibold': ['WorkSans_600SemiBold'],
        'sans-bold': ['WorkSans_700Bold'],
      },
    },
  },
  plugins: [],
};
