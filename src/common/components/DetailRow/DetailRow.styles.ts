import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    justifyContent: 'space-between' as const,
    gap: theme.metrics.spacing.p16,
    paddingVertical: theme.metrics.spacingV.p12,
    variants: {
      divider: {
        true: {
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border.default,
        },
      },
    },
  },
  label: {
    flexShrink: 0,
  },
  value: {
    flex: 1,
  },
}));
