import type { ViewProps } from 'react-native';

/** Props for the {@link Card} component. Extends ViewProps. */
export interface CardProps extends ViewProps {
  /**
   * Visual style of the card. Defaults to `'filled'`.
   * `'surface'` is a white card with a hairline border — the standard list/detail card.
   */
  variant?: 'filled' | 'elevated' | 'outlined' | 'surface';
  /** Whether the card responds to press interactions. Defaults to `false`. */
  pressable?: boolean;
  /** Callback invoked when the card is pressed. Only effective when `pressable` is `true`. */
  onPress?: () => void;
  /** Content rendered inside the card. */
  children: React.ReactNode;
}
