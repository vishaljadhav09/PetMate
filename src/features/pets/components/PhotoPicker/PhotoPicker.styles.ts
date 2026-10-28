import { StyleSheet } from 'react-native-unistyles';
import { hs } from '@/theme/metrics';

const THUMB_SIZE = hs(76);

export const styles = StyleSheet.create((theme) => ({
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: hs(12),
    overflow: 'hidden' as const,
    backgroundColor: theme.colors.background.surfaceAlt,
  },
  image: {
    width: '100%' as const,
    height: '100%' as const,
  },
  addTile: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: hs(12),
    borderWidth: 1,
    borderStyle: 'dashed' as const,
    borderColor: theme.colors.border.strong,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: theme.colors.background.surface,
  },
  removeBadge: {
    position: 'absolute' as const,
    top: hs(4),
    right: hs(4),
    width: hs(22),
    height: hs(22),
    borderRadius: hs(11),
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: theme.colors.background.surface,
  },
}));
