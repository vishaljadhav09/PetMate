import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { IconButton, Loading, ScreenContainer, Text } from '@/common/components';
import { PetForm } from '@/features/pets/components/PetForm';
import { usePet } from '@/features/pets/hooks/usePets';

export default function EditPetScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: pet, isLoading } = usePet(id);

  return (
    <ScreenContainer scrollable>
      <View className="mb-4 flex-row items-center gap-2">
        <IconButton
          icon="chevron-back"
          accessibilityLabel={t('common.back')}
          variant="ghost"
          onPress={() => router.back()}
        />
        <Text variant="h2">{t('petForm.editTitle')}</Text>
      </View>
      {isLoading || !pet ? (
        <Loading />
      ) : (
        <PetForm
          mode="edit"
          petId={pet.id}
          defaultValues={{
            name: pet.name,
            species: pet.species,
            breed: pet.breed,
            gender: pet.gender,
            dateOfBirth: pet.dateOfBirth,
            vaccinationUpToDate: pet.vaccinationUpToDate,
            pedigreeCertified: pet.pedigreeCertified,
            registrationNumber: pet.registrationNumber ?? '',
            description: pet.description,
            studTermsType: pet.studTerms.type,
            studFeeAmount:
              pet.studTerms.feeAmount !== undefined ? String(pet.studTerms.feeAmount) : '',
            city: pet.city,
            availableForMatching: pet.availableForMatching,
          }}
          onSuccess={() => router.back()}
        />
      )}
    </ScreenContainer>
  );
}
