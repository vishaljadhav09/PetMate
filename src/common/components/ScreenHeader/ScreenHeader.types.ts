import type { ReactNode } from 'react';

/** Props for the {@link ScreenHeader} component. */
export interface ScreenHeaderProps {
  /** Screen title. */
  title: string;
  /** Optional supporting line under the title (tab-root layout only). */
  subtitle?: string;
  /**
   * When provided the header switches to the compact "back" layout: a back
   * button, a smaller title and the `right` slot on one row.
   */
  onBack?: () => void;
  /** Content aligned to the end of the header (e.g. an overflow menu). Back layout only. */
  right?: ReactNode;
}
