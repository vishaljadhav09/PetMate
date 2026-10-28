import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenContainer, ScreenHeader } from '@/common/components';
import { PetForm } from '@/features/pets/components/PetForm';

export default function AddPetScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <ScreenContainer scrollable edges={['top', 'bottom']}>
      <ScreenHeader title={t('petForm.addTitle')} onBack={() => router.back()} />
      <PetForm mode="create" onSuccess={() => router.back()} />
    </ScreenContainer>
  );
}
