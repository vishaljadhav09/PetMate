import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';
import { Button, FormField, Input, Select, TextArea } from '@/common/components';
import { friendlyError } from '@/utils/friendlyError';
import { useCreateMatchRequest } from '../../hooks/useMatchRequests';
import { usePetOwner } from '../../hooks/usePets';
import { matchRequestSchema } from '../../schemas/matchRequestSchema';
import type { MatchRequestFormData } from '../../schemas/matchRequestSchema';
import type { Pet } from '../../types';

export interface SendMatchRequestFormProps {
  recipientPet: Pet;
  eligibleSenderPets: Pet[];
  /** Pre-selected sender pet, e.g. carried over from Discover's "matching for" picker. */
  defaultSenderPetId?: string;
  onSuccess: () => void;
}

export function SendMatchRequestForm({
  recipientPet,
  eligibleSenderPets,
  defaultSenderPetId,
  onSuccess,
}: SendMatchRequestFormProps) {
  const { t } = useTranslation();
  const createMatchRequest = useCreateMatchRequest();
  const { data: recipientOwner } = usePetOwner(recipientPet.ownerId);
  const preselected = eligibleSenderPets.find((pet) => pet.id === defaultSenderPetId);
  const { control, handleSubmit } = useForm<MatchRequestFormData>({
    resolver: zodResolver(matchRequestSchema),
    defaultValues: {
      senderPetId: preselected?.id ?? eligibleSenderPets[0]?.id ?? '',
      message: '',
      proposedDate: '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createMatchRequest.mutateAsync({
        senderPetId: values.senderPetId,
        recipientPetId: recipientPet.id,
        message: values.message.trim(),
        proposedDate: values.proposedDate?.trim() || undefined,
      });
      Toast.show({ type: 'success', text1: t('petDetail.requestSentSuccess') });
      onSuccess();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: friendlyError(error, t),
      });
    }
  });

  return (
    <View className="gap-3">
      <Controller
        name="senderPetId"
        control={control}
        render={({ field: { value, onChange } }) => (
          <Select
            label={t('petDetail.sendFromLabel')}
            value={value}
            onChange={onChange}
            options={eligibleSenderPets.map((pet) => ({
              label: `${pet.name} — ${pet.breed}`,
              value: pet.id,
            }))}
          />
        )}
      />

      <FormField
        name="message"
        control={control}
        label={t('petDetail.messageTo', { name: recipientOwner?.name.split(' ')[0] ?? '' })}
      >
        <TextArea placeholder={t('petDetail.messagePlaceholder')} />
      </FormField>

      <FormField name="proposedDate" control={control} label={t('petDetail.proposedDateLabel')}>
        <Input placeholder={t('petDetail.proposedDatePlaceholder')} />
      </FormField>

      <Button
        title={t('petDetail.sendRequestSubmit')}
        onPress={onSubmit}
        loading={createMatchRequest.isPending}
        fullWidth
      />
    </View>
  );
}
