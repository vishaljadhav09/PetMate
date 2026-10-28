import { describe, expect, it, jest } from '@jest/globals';
import { darkColors } from '../dark-theme';
import { lightColors } from '../light-theme';
import type { ThemeColors } from '../types';

type ColorPair = { DEFAULT: string; dark: string };
type ColorTree = Record<string, ColorPair | Record<string, ColorPair>>;

interface TailwindConfig {
  theme: { extend: { colors: ColorTree } };
}

// The preset only adds NativeWind's own utilities; loading it drags in the RN runtime.
jest.mock('nativewind/preset', () => ({}));

const { theme } = jest.requireActual<TailwindConfig>('../../../tailwind.config.js');
const tailwind = theme.extend.colors;

function pair(path: string): ColorPair {
  const [group, key] = path.split('.');
  const node = key ? (tailwind[group] as Record<string, ColorPair>)[key] : tailwind[group];
  return node as ColorPair;
}

/** tailwind color path -> how to read the same token from a ThemeColors object. */
const PARITY: Record<string, (colors: ThemeColors) => string> = {
  app: (c) => c.background.app,
  surface: (c) => c.background.surface,
  'surface-alt': (c) => c.background.surfaceAlt,
  section: (c) => c.background.section,
  border: (c) => c.border.default,
  'brand.primary': (c) => c.brand.primary,
  'brand.secondary': (c) => c.brand.secondary,
  'brand.tertiary': (c) => c.brand.tertiary,
  ink: (c) => c.text.primary,
  'ink-secondary': (c) => c.text.secondary,
  'ink-muted': (c) => c.text.muted,
  'state.success': (c) => c.state.success,
  'state.success-bg': (c) => c.state.successBg,
  'state.warning': (c) => c.state.warning,
  'state.warning-bg': (c) => c.state.warningBg,
  'state.error': (c) => c.state.error,
  'state.error-bg': (c) => c.state.errorBg,
  'state.info': (c) => c.state.info,
  'state.info-bg': (c) => c.state.infoBg,
};

describe('tailwind.config.js colors match the theme', () => {
  it.each(Object.keys(PARITY))('%s', (path) => {
    const read = PARITY[path];
    expect(pair(path).DEFAULT).toBe(read(lightColors));
    expect(pair(path).dark).toBe(read(darkColors));
  });
});
