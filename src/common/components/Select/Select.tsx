import { useCallback, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet as RNStyleSheet, View } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { Icon } from '@/common/components/Icon';
import { Text } from '@/common/components/Text';
import { styles } from './Select.styles';
import type { SelectProps } from './Select.types';

const ENTER_DURATION_MS = 180;

/**
 * A select field that lists its options in a bottom sheet. The sheet is a plain
 * `Modal`, so the field also works inside a `Dialog`.
 *
 * @example
 * ```tsx
 * <Select
 *   value={country}
 *   onChange={setCountry}
 *   options={[
 *     { label: 'Egypt', value: 'eg' },
 *     { label: 'USA', value: 'us' },
 *   ]}
 *   placeholder="Choose a country"
 *   label="Country"
 * />
 * ```
 */
export function Select({
  value,
  onChange,
  options,
  placeholder,
  label,
  error,
  disabled = false,
  size = 'md',
}: SelectProps) {
  const [open, setOpen] = useState(false);

  styles.useVariants({ size, error: !!error, disabled });

  const selectedOption = options.find((o) => o.value === value);
  const displayText = selectedOption?.label ?? placeholder ?? '';

  const handleOpen = useCallback(() => {
    if (!disabled) setOpen(true);
  }, [disabled]);

  const handleClose = useCallback(() => setOpen(false), []);

  const handleSelect = useCallback(
    (optionValue: string) => {
      setOpen(false);
      onChange(optionValue);
    },
    [onChange]
  );

  return (
    <View style={styles.wrapper}>
      {label && (
        <Text variant="label" style={styles.label}>
          {label}
        </Text>
      )}
      <Pressable
        onPress={handleOpen}
        disabled={disabled}
        accessibilityRole="combobox"
        accessibilityLabel={label}
        accessibilityState={{ expanded: open, disabled }}
      >
        <View style={styles.trigger}>
          <Text
            variant="body"
            numberOfLines={1}
            style={[
              styles.triggerText,
              selectedOption ? styles.selectedText : styles.placeholderText,
            ]}
          >
            {displayText}
          </Text>
          <Icon name="chevron-down" size={12} variant="tertiary" />
        </View>
      </Pressable>
      {error && (
        <Text variant="caption" style={styles.errorText}>
          {error}
        </Text>
      )}
      <Modal
        visible={open}
        transparent
        animationType="none"
        onRequestClose={handleClose}
        statusBarTranslucent
      >
        <Animated.View entering={FadeIn.duration(ENTER_DURATION_MS)} style={styles.backdrop}>
          <Pressable style={RNStyleSheet.absoluteFill} onPress={handleClose} />
          <Animated.View entering={SlideInDown.duration(ENTER_DURATION_MS)} style={styles.sheet}>
            <ScrollView
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              {options.map((item) => {
                const selected = item.value === value;
                return (
                  <Pressable
                    key={item.value}
                    onPress={() => handleSelect(item.value)}
                    disabled={item.disabled}
                    accessibilityRole="radio"
                    accessibilityState={{ selected, disabled: item.disabled }}
                  >
                    <View style={styles.option}>
                      <Text
                        variant="body"
                        style={[styles.optionText, selected && styles.optionTextSelected]}
                      >
                        {item.label}
                      </Text>
                      {selected && <Icon name="checkmark" size={18} variant="primary" />}
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          </Animated.View>
        </Animated.View>
      </Modal>
    </View>
  );
}
