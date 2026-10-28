import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Loading, ScreenContainer, ScreenHeader } from '@/common/components';
import { PetForm } from '@/features/pets/components/PetForm';
import { usePet } from '@/features/pets/hooks/usePets';

export default function EditPetScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: pet, isLoading } = usePet(id);

  return (
    <ScreenContainer scrollable edges={['top', 'bottom']}>
      <ScreenHeader title={t('petForm.editTitle')} onBack={() => router.back()} />
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
