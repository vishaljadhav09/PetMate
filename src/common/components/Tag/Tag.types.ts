/** Semantic color of a {@link Tag}. */
export type TagTone = 'neutral' | 'success' | 'warning' | 'error' | 'info' | 'muted';

/** Shape of a {@link Tag}: a plain fact tag, a bold verified badge, or a status pill. */
export type TagSize = 'tag' | 'badge' | 'status';

/** Props for the {@link Tag} component. */
export interface TagProps {
  /** Text shown inside the tag. */
  label: string;
  /** Semantic color. Defaults to `'neutral'`. */
  tone?: TagTone;
  /** Shape and type size. Defaults to `'tag'`. */
  size?: TagSize;
}
