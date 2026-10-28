import { FlatList, View } from 'react-native';
import { useBottomPadding } from '@/hooks/useBottomPadding';
import { useResponsiveColumns } from '@/hooks/useResponsiveColumns';
import { styles } from './ResponsiveList.styles';
import type { ResponsiveListProps } from './ResponsiveList.types';

/**
 * Vertical list that shows one column on phones and two on tablets/wide web
 * windows, and keeps its last row clear of the floating tab bar.
 *
 * @example
 * ```tsx
 * <ResponsiveList
 *   data={pets}
 *   keyExtractor={(pet) => pet.id}
 *   renderItem={(pet) => <PetCard pet={pet} />}
 *   emptyComponent={<EmptyState title="No pets" />}
 * />
 * ```
 */
export function ResponsiveList<T>({
  data,
  renderItem,
  keyExtractor,
  emptyComponent,
  withTabBar = true,
}: ResponsiveListProps<T>) {
  const columns = useResponsiveColumns();
  const tabBarPadding = useBottomPadding();

  return (
    <FlatList<T>
      // FlatList cannot change numColumns on the fly; remount when it changes.
      key={columns}
      numColumns={columns}
      style={[styles.list, columns > 1 && styles.gutterReset]}
      data={data}
      keyExtractor={keyExtractor}
      renderItem={({ item, index }) => (
        <View style={styles.cell(columns)}>{renderItem(item, index)}</View>
      )}
      contentContainerStyle={withTabBar ? { paddingBottom: tabBarPadding } : undefined}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={emptyComponent}
    />
  );
}
