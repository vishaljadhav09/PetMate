import type { ImageSource } from 'expo-image';
import { hs, rf } from '@/theme/metrics';

/** Available avatar size options, ranging from extra-small to extra-large. */
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** Props for the {@link Avatar} component. */
export interface AvatarProps {
  /** Image source to display. Takes priority over initials and icon. */
  source?: ImageSource;
  /** One or two character string rendered as initials fallback. */
  initials?: string;
  /** Custom icon node rendered as a fallback when no source or initials are provided. */
  icon?: React.ReactNode;
  /** Size of the avatar. Defaults to `'md'`. */
  size?: AvatarSize;
  /** Background color override for the initials/icon fallbacks. Defaults to the brand color. */
  color?: string;
  /** Accessibility label for screen readers. */
  accessibilityLabel?: string;
}

/** Mapping of avatar size tokens to their pixel dimensions (horizontally scaled). */
export const AVATAR_SIZES: Record<AvatarSize, number> = {
  xs: hs(26),
  sm: hs(32),
  md: hs(40),
  lg: hs(52),
  xl: hs(80),
};

/** Initials font size per avatar size (the prototype uses 12px at 26px and 18px at 52px). */
export const AVATAR_FONT_SIZES: Record<AvatarSize, number> = {
  xs: rf(12),
  sm: rf(13),
  md: rf(15),
  lg: rf(18),
  xl: rf(28),
};
