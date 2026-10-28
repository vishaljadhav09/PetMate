import { StyleSheet, type UnistylesVariants } from 'react-native-unistyles';
import { hs, rf, vs } from '@/theme/metrics';

export const SEGMENT_PADDING = hs(3);

// A cream track with a raised white pill under the active segment (.segmented in the prototype).
export const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row' as const,
    backgroundColor: theme.colors.background.surfaceAlt,
    borderRadius: hs(11),
    padding: SEGMENT_PADDING,
    position: 'relative' as const,
    variants: {
      disabled: {
        true: {
          opacity: 0.5,
        },
      },
    },
  },
  indicator: {
    position: 'absolute' as const,
    top: SEGMENT_PADDING,
    bottom: SEGMENT_PADDING,
    left: SEGMENT_PADDING,
    backgroundColor: theme.colors.background.surface,
    borderRadius: hs(9),
    elevation: 1,
    shadowColor: theme.colors.shadow.color,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 2,
  },
  // The cell shares the row equally and sits above the indicator.
  segment: {
    flex: 1,
    zIndex: 1,
  },
  segmentContent: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: vs(8),
    paddingHorizontal: hs(6),
    variants: {
      size: {
        sm: {
          paddingVertical: vs(6),
        },
        md: {
          paddingVertical: vs(8),
        },
      },
    },
  },
  segmentIcon: {
    marginRight: hs(4),
  },
  segmentText: {
    fontFamily: theme.fonts.semiBold,
    textAlign: 'center' as const,
    variants: {
      size: {
        sm: {
          fontSize: rf(11.5),
        },
        md: {
          fontSize: rf(12.5),
        },
      },
    },
  },
  count: {
    marginLeft: hs(3),
    fontFamily: theme.fonts.regular,
    fontSize: rf(10),
    color: theme.colors.text.muted,
  },
}));

export type SegmentedControlStyleVariants = UnistylesVariants<typeof styles>;
