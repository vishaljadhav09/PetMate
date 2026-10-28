import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet as RNStyleSheet,
  Text as RNText,
  View,
} from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { Button } from '@/common/components/Button';
import { Text } from '@/common/components/Text';
import { styles } from './Dialog.styles';
import type { DialogProps } from './Dialog.types';

const ENTER_DURATION_MS = 180;
const CLOSE_GLYPH = '✕';

/**
 * A bottom sheet over a dimmed backdrop, for confirmations, forms or custom content.
 *
 * @example
 * ```tsx
 * <Dialog
 *   visible={isOpen}
 *   onDismiss={() => setIsOpen(false)}
 *   title="Confirm"
 *   message="Are you sure?"
 *   actions={[{ label: 'OK', onPress: handleConfirm, variant: 'primary' }]}
 * />
 * ```
 */
export function Dialog({
  visible,
  onDismiss,
  title,
  message,
  actions = [],
  children,
  dismissOnBackdropPress = true,
}: DialogProps) {
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      <Animated.View entering={FadeIn.duration(ENTER_DURATION_MS)} style={styles.backdrop}>
        <Pressable
          style={RNStyleSheet.absoluteFill}
          onPress={dismissOnBackdropPress ? onDismiss : undefined}
          accessibilityLabel={t('common.close')}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoider}
        >
          <Animated.View entering={SlideInDown.duration(ENTER_DURATION_MS)} style={styles.sheet}>
            <ScrollView
              contentContainerStyle={styles.sheetContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              <View style={styles.head}>
                <Text variant="body" style={styles.title} accessibilityRole="header">
                  {title ?? ''}
                </Text>
                <Pressable
                  onPress={onDismiss}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={t('common.close')}
                >
                  <View style={styles.close}>
                    <RNText style={styles.closeGlyph}>{CLOSE_GLYPH}</RNText>
                  </View>
                </Pressable>
              </View>
              {message && <Text style={styles.message}>{message}</Text>}
              {children}
              {actions.length > 0 && (
                <View style={styles.actions}>
                  {actions.map((action) => (
                    <View key={action.label} style={styles.action}>
                      <Button
                        title={action.label}
                        variant={action.variant ?? 'outline'}
                        fullWidth
                        onPress={action.onPress}
                      />
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </Animated.View>
    </Modal>
  );
}
