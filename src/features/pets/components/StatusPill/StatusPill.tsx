import { Text, View } from 'react-native';

export type StatusPillTone = 'neutral' | 'success' | 'warning' | 'error' | 'info';

export interface StatusPillProps {
  label: string;
  tone?: StatusPillTone;
}

const CONTAINER_TONE_CLASSES: Record<StatusPillTone, string> = {
  neutral: 'bg-surface-alt dark:bg-surface-alt-dark',
  success: 'bg-state-success-bg dark:bg-state-success-bg-dark',
  warning: 'bg-state-warning-bg dark:bg-state-warning-bg-dark',
  error: 'bg-state-error-bg dark:bg-state-error-bg-dark',
  info: 'bg-state-info-bg dark:bg-state-info-bg-dark',
};

const TEXT_TONE_CLASSES: Record<StatusPillTone, string> = {
  neutral: 'text-ink-secondary dark:text-ink-secondary-dark',
  success: 'text-state-success dark:text-state-success-dark',
  warning: 'text-state-warning dark:text-state-warning-dark',
  error: 'text-state-error dark:text-state-error-dark',
  info: 'text-state-info dark:text-state-info-dark',
};

/**
 * Small colored status label (verified, breeding-eligibility, request status,
 * etc.). Built from raw RN primitives with NativeWind, not the shared `Badge`
 * component — `Badge` only renders a numeric count or a plain dot, it has no
 * text-label mode.
 */
export function StatusPill({ label, tone = 'neutral' }: StatusPillProps) {
  return (
    <View className={`self-start rounded-full px-2.5 py-1 ${CONTAINER_TONE_CLASSES[tone]}`}>
      <Text className={`text-xs font-semibold ${TEXT_TONE_CLASSES[tone]}`}>{label}</Text>
    </View>
  );
}
