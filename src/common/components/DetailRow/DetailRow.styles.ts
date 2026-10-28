import { StyleSheet } from 'react-native-unistyles';
import { hs, rf, vs } from '@/theme/metrics';

export const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    justifyContent: 'space-between' as const,
    gap: hs(16),
    paddingVertical: vs(9),
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
    fontSize: rf(13),
  },
  value: {
    flex: 1,
    fontSize: rf(13),
  },
}));
