import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';
import { Dialog, FormField, TextArea } from '@/common/components';
import { friendlyError } from '@/utils/friendlyError';
import { useCreateRating } from '../../hooks/useRatings';
import { ratingSchema } from '../../schemas/ratingSchema';
import type { RatingFormData } from '../../schemas/ratingSchema';
import { RatingStars } from '../RatingStars';

export interface RateOwnerDialogProps {
  visible: boolean;
  onDismiss: () => void;
  matchRequestId: string;
  ratedUserName: string;
}

export function RateOwnerDialog({
  visible,
  onDismiss,
  matchRequestId,
  ratedUserName,
}: RateOwnerDialogProps) {
  const { t } = useTranslation();
  const createRating = useCreateRating();
  const { control, handleSubmit, reset, watch } = useForm<RatingFormData>({
    resolver: zodResolver(ratingSchema),
    defaultValues: { stars: 5, comment: '' },
  });

  const stars = watch('stars');

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createRating.mutateAsync({
        matchRequestId,
        stars: values.stars as 1 | 2 | 3 | 4 | 5,
        comment: values.comment?.trim() || undefined,
      });
      Toast.show({ type: 'success', text1: t('requests.rate.success') });
      reset();
      onDismiss();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: friendlyError(error, t),
      });
    }
  });

  return (
    <Dialog
      visible={visible}
      onDismiss={onDismiss}
      title={t('requests.rate.title', { name: ratedUserName })}
      actions={[
        { label: t('common.cancel'), onPress: onDismiss, variant: 'ghost' },
        { label: t('requests.rate.submit'), onPress: () => onSubmit(), variant: 'primary' },
      ]}
    >
      <View className="gap-4">
        <Controller
          name="stars"
          control={control}
          render={({ field: { onChange } }) => (
            <RatingStars value={stars} onChange={onChange} size={28} />
          )}
        />
        <FormField name="comment" control={control} label={t('requests.rate.commentLabel')}>
          <TextArea placeholder={t('requests.rate.commentPlaceholder')} />
        </FormField>
      </View>
    </Dialog>
  );
}
