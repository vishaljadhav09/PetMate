/** Semantic color of a {@link Tag}. */
export type TagTone = 'neutral' | 'success' | 'warning' | 'error' | 'info';

/** Props for the {@link Tag} component. */
export interface TagProps {
  /** Text shown inside the tag. */
  label: string;
  /** Semantic color. Defaults to `'neutral'`. */
  tone?: TagTone;
}
