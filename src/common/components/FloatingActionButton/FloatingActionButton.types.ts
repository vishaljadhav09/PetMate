import type { PressableProps } from 'react-native';

/** Props for the {@link FloatingActionButton} component. */
export interface FloatingActionButtonProps extends Pick<PressableProps, 'onPress'> {
  /** Screen-reader label; the visible glyph is only a "+". */
  accessibilityLabel: string;
}
