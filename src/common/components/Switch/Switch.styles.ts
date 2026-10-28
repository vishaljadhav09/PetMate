import { StyleSheet, type UnistylesVariants } from 'react-native-unistyles';
import { hs, rf, vs } from '@/theme/metrics';

export const SWITCH_THUMB_TRAVEL = hs(17);

// Track 40x23 with a 17px thumb inset 3px, as in the prototype's .switch.
export const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingVertical: vs(4),
    variants: {
      disabled: {
        true: {
          opacity: 0.5,
        },
      },
    },
  },
  labelBlock: {
    flex: 1,
    marginRight: hs(12),
  },
  label: {
    fontSize: rf(13.5),
  },
  description: {
    marginTop: vs(1),
    fontSize: rf(11.5),
    color: theme.colors.text.secondary,
  },
  switchWrapper: {
    variants: {
      size: {
        sm: {
          transform: [{ scale: 0.85 }],
        },
        md: {
          transform: [{ scale: 1.0 }],
        },
        lg: {
          transform: [{ scale: 1.15 }],
        },
      },
    },
  },
  track: {
    width: hs(40),
    height: hs(23),
    borderRadius: 999,
    backgroundColor: theme.colors.border.default,
    variants: {
      on: {
        true: {
          backgroundColor: theme.colors.brand.primary,
        },
      },
    },
  },
  thumb: {
    position: 'absolute' as const,
    top: hs(3),
    left: hs(3),
    width: hs(17),
    height: hs(17),
    borderRadius: 999,
    backgroundColor: theme.colors.text.inverse,
    shadowColor: theme.colors.shadow.color,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 1,
    elevation: 1,
  },
}));

export type SwitchStyleVariants = UnistylesVariants<typeof styles>;
