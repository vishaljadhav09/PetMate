import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { vs } from '@/theme/metrics';
import { styles } from './TabBar.styles';
import type { TabBarProps } from './TabBar.types';

/** Emoji glyph shown above each tab label. */
const TAB_GLYPHS: Record<string, string> = {
  index: '🐾',
  'my-pets': '🏡',
  requests: '✉️',
  profile: '👤',
};

const MIN_BOTTOM_PADDING = vs(12);

export function TabBar({ state, descriptors, navigation, badges }: TabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.container, { paddingBottom: Math.max(insets.bottom, MIN_BOTTOM_PADDING) }]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const label =
          typeof options.tabBarLabel === 'string'
            ? options.tabBarLabel
            : (options.title ?? route.name);
        const badgeCount = badges?.[route.name] ?? 0;

        return (
          <View key={route.key} style={styles.tabCell}>
            <Pressable
              onPress={onPress}
              onLongPress={onLongPress}
              accessibilityRole="tab"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={options.tabBarAccessibilityLabel}
            >
              <View style={styles.tab}>
                {badgeCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{badgeCount}</Text>
                  </View>
                )}
                <Text style={styles.glyph}>{TAB_GLYPHS[route.name] ?? '•'}</Text>
                <Text style={[styles.label, isFocused ? styles.labelActive : styles.labelInactive]}>
                  {label}
                </Text>
              </View>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}
