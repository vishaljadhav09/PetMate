import type { ThemeColors } from './types';

/**
 * Dark Theme
 *
 * Night version of the PetMate palette: the same forest, marigold and clay
 * hues, lightened so they stay readable on a warm near-black background.
 *
 * Color Philosophy:
 * - Primary: Sage (#8DB596) - the forest green, lifted for dark surfaces
 * - Secondary: Pale Sage (#C5D8C8) - soft readable accents
 * - Tertiary: Marigold (#F0B55A) - warm accent that glows on dark
 * - Error: Soft Clay (#E58A6B)
 */
export const darkColors: ThemeColors = {
  mode: 'dark',

  avatar: ['#5C7A63', '#C0644A', '#C98B2E', '#7A9A81', '#A9744F', '#4F7059'],

  brand: {
    primary: '#8DB596',
    secondary: '#C5D8C8',
    tertiary: '#F0B55A',
    primaryVariant: '#A9CBB1',
    secondaryVariant: '#DCE9DE',
  },

  background: {
    app: '#14130F',
    surface: '#1E1C17',
    surfaceAlt: '#29261F',
    section: '#1F2B22',
    elevated: '#26231D',
    input: '#1E1C17',
    disabled: '#1A1812',
    modal: '#1E1C17',
  },

  text: {
    primary: '#F4EFE3',
    secondary: '#C9C1B1',
    tertiary: '#A39B8A',
    muted: '#7D7666',
    inverse: '#14130F',
    accent: '#F0B55A',
    link: '#8DB596',
    linkHover: '#A9CBB1',
  },

  border: {
    default: '#38342B',
    subtle: '#26231D',
    strong: '#4E4939',
    focus: '#8DB596',
    disabled: '#26231D',
  },

  icon: {
    primary: '#8DB596',
    secondary: '#C5D8C8',
    tertiary: '#7D7666',
    muted: '#4E4939',
    inverse: '#14130F',
    accent: '#F0B55A',
  },

  state: {
    success: '#8DB596',
    successBg: 'rgba(141, 181, 150, 0.18)',
    warning: '#F0B55A',
    warningBg: 'rgba(240, 181, 90, 0.18)',
    error: '#E58A6B',
    errorBg: 'rgba(229, 138, 107, 0.18)',
    info: '#A9CBB1',
    infoBg: 'rgba(169, 203, 177, 0.16)',
    disabled: '#4E4939',
  },

  overlay: {
    modal: 'rgba(0, 0, 0, 0.7)',
    pressed: 'rgba(141, 181, 150, 0.15)',
    hover: 'rgba(141, 181, 150, 0.08)',
    focus: 'rgba(141, 181, 150, 0.2)',
    ripple: 'rgba(255, 255, 255, 0.2)',
    shadow: 'rgba(0, 0, 0, 0.5)',
  },

  gradient: {
    primary: ['#1F2B22', '#8DB596'],
    secondary: ['#8DB596', '#A9CBB1'],
    accent: ['#B9791E', '#F0B55A'],
    success: ['#3C5A46', '#8DB596'],
    highlight: ['#F0B55A', '#F7D08F'],
  },

  shadow: {
    color: 'rgba(0, 0, 0, 0.5)',
    elevation: 6,
    elevationSmall: 2,
    elevationMedium: 6,
    elevationLarge: 12,
  },
};

export default darkColors;
