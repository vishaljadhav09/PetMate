import { StyleSheet } from 'react-native-unistyles';
import { hs, rf, vs } from '@/theme/metrics';

export const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: 'row' as const,
    gap: hs(12),
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: hs(6),
  },
  name: {
    flexShrink: 1,
    color: theme.colors.text.primary,
  },
  distance: {
    marginLeft: hs(6),
    fontSize: rf(12),
    color: theme.colors.text.muted,
  },
  meta: {
    marginTop: vs(2),
    color: theme.colors.text.secondary,
  },
  tags: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: hs(6),
    marginTop: vs(7),
  },
}));
