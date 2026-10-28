import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Loading, ScreenContainer, ScreenHeader } from '@/common/components';
import { PetForm } from '@/features/pets/components/PetForm';
import { usePet, usePetAddress } from '@/features/pets/hooks/usePets';

export default function EditPetScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: pet, isLoading } = usePet(id);
  const { data: address, isLoading: isAddressLoading } = usePetAddress(id);

  return (
    <ScreenContainer scrollable edges={['top', 'bottom']}>
      <ScreenHeader title={t('petForm.editTitle')} onBack={() => router.back()} />
      {isLoading || isAddressLoading || !pet ? (
        <Loading />
      ) : (
        <PetForm
          mode="edit"
          petId={pet.id}
          hasCertificate={!!pet.certificatePath}
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
            addressLine: address?.addressLine ?? '',
            city: pet.city,
            state: address?.state ?? '',
            pincode: address?.pincode ?? '',
            photos: pet.photos,
            lastVetCheckup: pet.lastVetCheckup ?? '',
            hipScore: pet.hipScore ?? '',
            litterRef: pet.litterRef ?? '',
            ownerAttestsBreedingReady: pet.ownerAttestsBreedingReady,
            availableForMatching: pet.availableForMatching,
          }}
          onSuccess={() => router.back()}
        />
      )}
    </ScreenContainer>
  );
}
