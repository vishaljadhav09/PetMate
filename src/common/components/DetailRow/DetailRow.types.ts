/** Props for the {@link DetailRow} component. */
export interface DetailRowProps {
  /** Left-hand label (the field name). */
  label: string;
  /** Right-hand value. */
  value: string;
  /** Whether to draw a hairline under the row. Defaults to `false`. */
  divider?: boolean;
}
