import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { vs } from '@/theme/metrics';

/** The prototype keeps 90px of clear space under scrollable content for its tab bar. */
const TAB_BAR_CLEARANCE = vs(90);

export function useBottomPadding() {
  const { bottom } = useSafeAreaInsets();

  return TAB_BAR_CLEARANCE + bottom;
}
