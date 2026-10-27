/**
 * NativeWind (Tailwind) config.
 *
 * `theme.extend.colors` below is a STARTER set — only the tokens the current
 * NativeWind-styled screens/components actually use, ported directly from the
 * values in `src/theme/light-theme.ts` / `src/theme/dark-theme.ts` (light value
 * as the base, dark value as the `-dark` suffix). It intentionally does not yet
 * cover the full `ThemeColors` palette (only `state.*` plus one text tone are
 * ported so far, alongside overlay/gradient/shadow, etc.) —
 * that full port, plus migrating the existing `react-native-unistyles`-based
 * common components onto these classes, is tracked as the larger NativeWind
 * cutover described in the `build-feature` skill (Section 0), not done here.
 *
 * `darkMode: 'media'` follows the OS color scheme automatically for now. It is
 * NOT yet wired to this app's existing manual light/dark toggle
 * (`src/theme/themeManager.ts`, still unistyles-driven) — that reconciliation
 * also belongs to the full cutover.
 */
module.exports = {
  darkMode: 'media',
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        app: { DEFAULT: '#F8FAFC', dark: '#0F172A' },
        surface: { DEFAULT: '#FFFFFF', dark: '#192236' },
        'surface-alt': { DEFAULT: '#F1F5F9', dark: '#262F44' },
        border: { DEFAULT: '#E2E8F0', dark: '#2C3548' },
        brand: {
          primary: { DEFAULT: '#6366F1', dark: '#818CF8' },
          tertiary: { DEFAULT: '#14B8A6', dark: '#2DD4BF' },
        },
        'ink-secondary': { DEFAULT: '#334155', dark: '#CBD5E1' },
        state: {
          success: { DEFAULT: '#10B981', dark: 'rgba(52, 211, 153, 0.8)' },
          'success-bg': { DEFAULT: '#ECFDF5', dark: 'rgba(16, 185, 129, 0.15)' },
          warning: { DEFAULT: '#F59E0B', dark: '#FBBF24' },
          'warning-bg': { DEFAULT: 'rgba(245, 158, 11, 0.12)', dark: 'rgba(251, 191, 36, 0.2)' },
          error: { DEFAULT: '#EF4444', dark: '#F87171' },
          'error-bg': { DEFAULT: 'rgba(239, 68, 68, 0.12)', dark: 'rgba(248, 113, 113, 0.2)' },
          info: { DEFAULT: '#3B82F6', dark: '#60A5FA' },
          'info-bg': { DEFAULT: 'rgba(59, 130, 246, 0.12)', dark: 'rgba(96, 165, 250, 0.2)' },
        },
      },
    },
  },
  plugins: [],
};
