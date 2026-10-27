import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { IconButton, ScreenContainer, Text } from '@/common/components';
import { PetForm } from '@/features/pets/components/PetForm';

export default function AddPetScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <ScreenContainer scrollable>
      <View className="mb-4 flex-row items-center gap-2">
        <IconButton
          icon="chevron-back"
          accessibilityLabel={t('common.back')}
          variant="ghost"
          onPress={() => router.back()}
        />
        <Text variant="h2">{t('petForm.addTitle')}</Text>
      </View>
      <PetForm mode="create" onSuccess={() => router.back()} />
    </ScreenContainer>
  );
}
