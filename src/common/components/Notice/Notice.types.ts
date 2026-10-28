/** Semantic color of a {@link Notice}. */
export type NoticeTone = 'info' | 'success' | 'warning' | 'error';

/** Props for the {@link Notice} component. */
export interface NoticeProps {
  /** Message shown in the banner. */
  message: string;
  /** Semantic color. Defaults to `'info'`. */
  tone?: NoticeTone;
  /** Leading emoji. Defaults to one matching the tone. */
  glyph?: string;
}
