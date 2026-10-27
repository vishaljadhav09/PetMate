import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';
import { Button, FormField, Input, Text } from '@/common/components';
import { useUpdateProfile } from '../../hooks/useProfile';
import { profileSchema } from '../../schemas/profileSchema';
import type { ProfileFormData } from '../../schemas/profileSchema';
import type { MyProfile } from '../../types';

export interface ProfileFormProps {
  profile: MyProfile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const { t } = useTranslation();
  const updateProfile = useUpdateProfile();
  const { control, handleSubmit } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: profile.name, city: profile.city, phone: profile.phone },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await updateProfile.mutateAsync(values);
      Toast.show({ type: 'success', text1: t('profile.saveSuccess') });
    } catch {
      Toast.show({ type: 'error', text1: t('errors.generic') });
    }
  });

  return (
    <View className="gap-4">
      <FormField name="name" control={control} label={t('profile.nameLabel')} required>
        <Input autoCapitalize="words" />
      </FormField>

      <FormField name="city" control={control} label={t('profile.cityLabel')}>
        <Input autoCapitalize="words" />
      </FormField>

      <View className="gap-1">
        <FormField name="phone" control={control} label={t('profile.phoneLabel')}>
          <Input keyboardType="phone-pad" placeholder={t('profile.phonePlaceholder')} />
        </FormField>
        <Text variant="caption" color="secondary">
          {t('profile.phoneHelp')}
        </Text>
      </View>

      <Button
        title={t('common.save')}
        onPress={onSubmit}
        loading={updateProfile.isPending}
        fullWidth
      />
    </View>
  );
}
