import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';
import { Button, FormField, Input, Text } from '@/common/components';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import { useUpdateProfile } from '../../hooks/useProfile';
import { profileSchema } from '../../schemas/profileSchema';
import type { ProfileFormData } from '../../schemas/profileSchema';
import type { MyProfile, UpdateProfileData } from '../../types';

export interface ProfileFormProps {
  profile: MyProfile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const { t } = useTranslation();
  const updateProfile = useUpdateProfile();
  const location = useCurrentLocation();
  const { control, handleSubmit } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name,
      addressLine: profile.addressLine,
      city: profile.city,
      state: profile.state,
      pincode: profile.pincode,
      phone: profile.phone,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const data: UpdateProfileData = { ...values };
      const addressFields = ['addressLine', 'city', 'state', 'pincode'] as const;
      const addressChanged = addressFields.some((field) => values[field] !== profile[field]);
      if (addressChanged) {
        // Geocode the home address so Discover can search from it. If it can't be resolved, keep
        // the text but drop the stale coordinates rather than measuring from the old address.
        const hasAddress = values.addressLine !== '' || values.pincode !== '';
        data.homeLocation = hasAddress ? await location.setFromAddress(values) : null;
        if (hasAddress && !data.homeLocation) {
          Toast.show({ type: 'info', text1: t('profile.addressNotFound') });
        }
      }
      await updateProfile.mutateAsync(data);
      Toast.show({ type: 'success', text1: t('profile.saveSuccess') });
    } catch {
      Toast.show({ type: 'error', text1: t('errors.generic') });
    }
  });

  return (
    <View className="gap-3">
      <FormField name="name" control={control} label={t('profile.nameLabel')}>
        <Input autoCapitalize="words" />
      </FormField>

      <View className="gap-1">
        <FormField name="addressLine" control={control} label={t('profile.addressLineLabel')}>
          <Input autoCapitalize="words" placeholder={t('profile.addressLinePlaceholder')} />
        </FormField>
        <Text variant="caption" color="secondary">
          {t('profile.addressHelp')}
        </Text>
      </View>

      <FormField name="city" control={control} label={t('profile.cityLabel')}>
        <Input autoCapitalize="words" />
      </FormField>

      <View className="flex-row gap-2.5">
        <View className="flex-1">
          <FormField name="state" control={control} label={t('profile.stateLabel')}>
            <Input autoCapitalize="words" />
          </FormField>
        </View>
        <View className="flex-1">
          <FormField name="pincode" control={control} label={t('profile.pincodeLabel')}>
            <Input keyboardType="number-pad" maxLength={6} />
          </FormField>
        </View>
      </View>

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
        loading={updateProfile.isPending || location.status === 'loading'}
        fullWidth
      />
    </View>
  );
}
