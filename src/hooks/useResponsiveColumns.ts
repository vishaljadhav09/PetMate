import { useScreenDimensions } from './useScreenDimensions';

/**
 * Number of list columns for the current window width: one on phones, two on
 * tablets and wide web windows. Recomputes on rotation / resize.
 */
export function useResponsiveColumns(): number {
  const { isTablet } = useScreenDimensions();
  return isTablet ? 2 : 1;
}
