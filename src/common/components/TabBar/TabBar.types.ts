import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

export type TabBarProps = BottomTabBarProps & {
  /** Count bubbles keyed by route name (e.g. `{ requests: 2 }`). Zero or missing hides the bubble. */
  badges?: Record<string, number>;
};
