import type { ThemeColors } from './types';

/**
 * Light Theme
 *
 * Warm, earthy palette taken from the PetMate prototype.
 *
 * Color Philosophy:
 * - Primary: Forest (#24402F) - calm, trustworthy, natural
 * - Secondary: Deep Forest (#16281C) - strong readable headings
 * - Tertiary: Marigold (#E8A33D) - warm accent for highlights and actions
 * - Error: Clay (#B24A2C) - warm red that fits the cream background
 */
export const lightColors: ThemeColors = {
  mode: 'light',

  avatar: ['#24402F', '#B24A2C', '#B9791E', '#5C7A63', '#8C5A3C', '#3C5A46'],

  brand: {
    primary: '#24402F',
    secondary: '#16281C',
    tertiary: '#E8A33D',
    primaryVariant: '#16281C',
    secondaryVariant: '#3C5A46',
  },

  background: {
    app: '#FAF6EC',
    surface: '#FFFFFF',
    surfaceAlt: '#F0EADA',
    section: '#E4ECE3',
    elevated: '#FFFFFF',
    input: '#FFFFFF',
    disabled: '#E4DCC8',
    modal: '#FAF6EC',
  },

  text: {
    primary: '#221F1A',
    secondary: '#6B6459',
    tertiary: '#8A8273',
    muted: '#A79E8C',
    inverse: '#FFFFFF',
    accent: '#B9791E',
    link: '#24402F',
    linkHover: '#16281C',
  },

  border: {
    default: '#E4DCC8',
    subtle: '#EFE8D6',
    strong: '#CFC5AB',
    focus: '#24402F',
    disabled: '#E4DCC8',
  },

  icon: {
    primary: '#24402F',
    secondary: '#16281C',
    tertiary: '#A79E8C',
    muted: '#CFC5AB',
    inverse: '#FFFFFF',
    accent: '#E8A33D',
  },

  state: {
    success: '#24402F',
    successBg: '#E4ECE3',
    warning: '#B9791E',
    warningBg: '#FBEDD3',
    error: '#B24A2C',
    errorBg: '#F5DFD4',
    info: '#3C5A46',
    infoBg: '#E4ECE3',
    disabled: '#CFC5AB',
  },

  overlay: {
    modal: 'rgba(22, 20, 15, 0.42)',
    pressed: 'rgba(36, 64, 47, 0.12)',
    hover: 'rgba(36, 64, 47, 0.08)',
    focus: 'rgba(36, 64, 47, 0.15)',
    ripple: 'rgba(255, 255, 255, 0.25)',
    shadow: 'rgba(34, 31, 26, 0.1)',
  },

  gradient: {
    primary: ['#16281C', '#24402F'],
    secondary: ['#24402F', '#3C5A46'],
    accent: ['#B9791E', '#E8A33D'],
    success: ['#24402F', '#5C7A63'],
    highlight: ['#E8A33D', '#F2C374'],
  },

  shadow: {
    color: 'rgba(34, 31, 26, 0.18)',
    elevation: 3,
    elevationSmall: 1,
    elevationMedium: 3,
    elevationLarge: 8,
  },
};

export default lightColors;
