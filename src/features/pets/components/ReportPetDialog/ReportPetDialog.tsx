import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';
import { Dialog, FormField, RadioGroup, Text, TextArea } from '@/common/components';
import { useCreateReport } from '../../hooks/useReports';
import { reportSchema } from '../../schemas/reportSchema';
import type { ReportFormData } from '../../schemas/reportSchema';
import type { ReportReason } from '../../types';

export interface ReportPetDialogProps {
  visible: boolean;
  onDismiss: () => void;
  petId: string;
}

const REPORT_REASONS: ReportReason[] = [
  'underage_pet',
  'no_health_docs',
  'spam',
  'scam',
  'abuse_concern',
];

export function ReportPetDialog({ visible, onDismiss, petId }: ReportPetDialogProps) {
  const { t } = useTranslation();
  const createReport = useCreateReport();
  const { control, handleSubmit, reset } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: { reason: 'no_health_docs', details: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createReport.mutateAsync({
        petId,
        reason: values.reason,
        details: values.details?.trim() || undefined,
      });
      Toast.show({ type: 'success', text1: t('petDetail.report.success') });
      reset();
      onDismiss();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error instanceof Error ? error.message : t('errors.generic'),
      });
    }
  });

  return (
    <Dialog
      visible={visible}
      onDismiss={onDismiss}
      title={t('petDetail.report.title')}
      actions={[
        { label: t('common.cancel'), onPress: onDismiss, variant: 'ghost' },
        { label: t('petDetail.report.submit'), onPress: () => onSubmit(), variant: 'primary' },
      ]}
    >
      <View className="gap-4">
        <View className="gap-2">
          <Text variant="label">{t('petDetail.report.reasonLabel')}</Text>
          <Controller
            name="reason"
            control={control}
            render={({ field: { value, onChange } }) => (
              <RadioGroup
                value={value}
                onChange={(next) => onChange(next as ReportReason)}
                options={REPORT_REASONS.map((reason) => ({
                  label: t(`petDetail.report.reasons.${reason}`),
                  value: reason,
                }))}
              />
            )}
          />
        </View>
        <FormField name="details" control={control} label={t('petDetail.report.detailsLabel')}>
          <TextArea placeholder={t('petDetail.report.detailsPlaceholder')} />
        </FormField>
      </View>
    </Dialog>
  );
}
