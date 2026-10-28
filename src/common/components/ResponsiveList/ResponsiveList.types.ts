import type { ReactElement } from 'react';

/** Props for the {@link ResponsiveList} component. */
export interface ResponsiveListProps<T> {
  /** Items to render. */
  data: readonly T[];
  /** Renders one item. Called once per item regardless of column count. */
  renderItem: (item: T, index: number) => ReactElement;
  /** Returns a unique key for an item. */
  keyExtractor: (item: T) => string;
  /** Rendered above the first item and scrolled with the list (title, filters). */
  headerComponent?: ReactElement;
  /** Rendered when `data` is empty. */
  emptyComponent?: ReactElement;
  /**
   * Adds bottom padding so the last row clears the floating tab bar.
   * Defaults to `true`; set `false` for lists on pushed (non-tab) screens.
   */
  withTabBar?: boolean;
  /** Called when the end of the list is reached, e.g. to load the next page. */
  onEndReached?: () => void;
  /** Rendered after the last item, e.g. a loading indicator. */
  footerComponent?: ReactElement;
}
