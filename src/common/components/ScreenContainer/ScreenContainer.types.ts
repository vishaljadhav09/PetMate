import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';

/** Props for the {@link ScreenContainer} component. */
export interface ScreenContainerProps {
  /** Content to render inside the screen container. */
  children: ReactNode;
  /** Whether the container should be scrollable via a ScrollView. Defaults to `false`. */
  scrollable?: boolean;
  /** Whether to apply horizontal and vertical padding. Defaults to `true`. */
  padded?: boolean;
  /** Safe area edges to respect. Defaults to `['top']`. */
  edges?: ('top' | 'bottom')[];
  /**
   * Max width of the centered content on tablets/web. `'narrow'` (default) suits
   * forms and detail pages; `'wide'` suits lists that show two columns.
   */
  contentWidth?: 'narrow' | 'wide';
  /**
   * Adds bottom padding so content is not hidden behind the floating tab bar.
   * Set on screens that live inside the tab navigator. Defaults to `false`.
   */
  withTabBar?: boolean;
  /** Additional styles applied to the container or scroll content. */
  style?: ViewStyle;
}
