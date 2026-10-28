import { View, ScrollView } from 'react-native';
import { useBottomPadding } from '@/hooks/useBottomPadding';
import { styles } from './ScreenContainer.styles';
import type { ScreenContainerProps } from './ScreenContainer.types';

/**
 * A safe-area-aware screen wrapper that supports both static and scrollable layouts.
 * Content is centered with a maximum width so it stays readable on tablets and web.
 *
 * @example
 * ```tsx
 * <ScreenContainer scrollable withTabBar>
 *   <Text>Screen content</Text>
 * </ScreenContainer>
 * ```
 */
export function ScreenContainer({
  children,
  scrollable = false,
  padded = true,
  edges = ['top'],
  contentWidth = 'narrow',
  withTabBar = false,
  style,
}: ScreenContainerProps) {
  const tabBarPadding = useBottomPadding();
  const hasTop = edges.includes('top');
  const hasBottom = edges.includes('bottom');
  const bottomStyle = withTabBar ? { paddingBottom: tabBarPadding } : undefined;

  styles.useVariants({ width: contentWidth, fill: !scrollable });

  if (scrollable) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          hasTop && styles.edgeTop,
          hasBottom && styles.edgeBottom,
          padded && styles.padded,
          bottomStyle,
          style,
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>{children}</View>
      </ScrollView>
    );
  }

  return (
    <View
      style={[
        styles.container,
        hasTop && styles.edgeTop,
        hasBottom && styles.edgeBottom,
        padded && styles.padded,
        style,
      ]}
    >
      <View style={styles.content}>{children}</View>
    </View>
  );
}
