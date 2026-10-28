import { StyleSheet, type UnistylesVariants } from 'react-native-unistyles';
import { vs } from '@/theme/metrics';

export const styles = StyleSheet.create((theme) => ({
  // The prototype's textarea is 64px tall at minimum (border included) and grows with its content.
  textArea: {
    minHeight: vs(62),
    paddingTop: vs(9),
  },
  counter: {
    textAlign: 'right' as const,
    color: theme.colors.text.muted,
    marginTop: vs(4),
  },
}));

export type TextAreaStyleVariants = UnistylesVariants<typeof styles>;
