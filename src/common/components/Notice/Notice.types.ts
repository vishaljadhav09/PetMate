import type { IconProps } from '@/common/components/Icon';

/** Semantic color of a {@link Notice}. */
export type NoticeTone = 'info' | 'success' | 'warning' | 'error';

/** Props for the {@link Notice} component. */
export interface NoticeProps {
  /** Message shown in the banner. */
  message: string;
  /** Semantic color. Defaults to `'info'`. */
  tone?: NoticeTone;
  /** Leading icon. Defaults to an icon matching the tone. */
  icon?: IconProps['name'];
}
