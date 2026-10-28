import { StyleSheet } from 'react-native-unistyles';
import { hs } from '@/theme/metrics';

// .pet-avatar (62px, 14px radius) and .detail-avatar (78px, 18px radius) in the prototype.
export const PET_AVATAR_SIZES = {
  lg: { size: hs(62), radius: hs(14), emoji: 26 },
  xl: { size: hs(78), radius: hs(18), emoji: 34 },
} as const;

export const styles = StyleSheet.create(() => ({
  box: (size: number, radius: number, backgroundColor: string) => ({
    width: size,
    height: size,
    borderRadius: radius,
    backgroundColor,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    overflow: 'hidden' as const,
  }),
  image: {
    width: '100%' as const,
    height: '100%' as const,
  },
  emoji: (fontSize: number) => ({ fontSize }),
}));
