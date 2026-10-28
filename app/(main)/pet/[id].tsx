import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import {
  Button,
  Card,
  Dialog,
  DetailRow,
  IconButton,
  Loading,
  Notice,
  ScreenContainer,
  ScreenHeader,
  Tag,
  Text,
} from '@/common/components';
import { PetAvatar } from '@/features/pets/components/PetAvatar';
import { PetOwnerCard } from '@/features/pets/components/PetOwnerCard';
import { ReportPetDialog } from '@/features/pets/components/ReportPetDialog';
import { SendMatchRequestForm } from '@/features/pets/components/SendMatchRequestForm';
import { useFavoritePetIds, useToggleFavorite } from '@/features/pets/hooks/useFavorites';
import { useMyPets, usePet, usePetOwner } from '@/features/pets/hooks/usePets';
import { ageLabel, isBreedingEligible } from '@/features/pets/utils/breedingEligibility';
import { getMatchIncompatibilityReason } from '@/features/pets/utils/matchCompatibility';

export default function PetDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id, senderPetId } = useLocalSearchParams<{ id: string; senderPetId?: string }>();
  const { data: pet, isLoading: isPetLoading } = usePet(id);
  const ownerId = pet?.ownerId ?? '';
  const { data: owner } = usePetOwner(ownerId);
  const { data: myPets } = useMyPets();
  const { data: favoriteIds } = useFavoritePetIds();
  const toggleFavorite = useToggleFavorite();
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  if (isPetLoading || !pet) {
    return (
      <ScreenContainer>
        <Loading fullScreen />
      </ScreenContainer>
    );
  }

  const isFavorite = (favoriteIds ?? []).includes(pet.id);
  const eligible = isBreedingEligible(pet);
  const age = ageLabel(pet.dateOfBirth);
  const eligibleSenderPets = (myPets ?? []).filter(
    (candidate) => getMatchIncompatibilityReason(candidate, pet) === null
  );
  const firstOwnPet = myPets?.[0];
  const incompatibilityReason = firstOwnPet
    ? (getMatchIncompatibilityReason(firstOwnPet, pet) ?? 'senderIneligible')
    : 'senderIneligible';

  const studTermsLabel =
    pet.studTerms.type === 'fixedFee'
      ? `${t('pets.studTerms.fixedFee')} — ${pet.studTerms.feeAmount ?? 0}`
      : t(`pets.studTerms.${pet.studTerms.type}`);

  let pedigreeValue = t('pets.pedigreeValue.notCertified');
  if (pet.pedigreeCertified) {
    pedigreeValue = pet.registrationNumber
      ? `${t('pets.pedigreeValue.certified')} · ${pet.registrationNumber}`
      : t('pets.pedigreeValue.certified');
  }

  const locationValue =
    pet.distanceKm !== undefined
      ? `${pet.city} · ${t('discover.distanceAway', { distance: pet.distanceKm })} · ${t('petDetail.approximate')}`
      : `${pet.city} · ${t('petDetail.approximate')}`;

  const hasOwnPets = !!myPets && myPets.length > 0;
  const canSendRequest = hasOwnPets && eligible && eligibleSenderPets.length > 0;
  let blockedReason: string | null = null;
  if (!hasOwnPets) {
    blockedReason = t('petDetail.noOwnPetMessage');
  } else if (eligibleSenderPets.length === 0) {
    blockedReason = t(`pets.matchIncompatibility.${incompatibilityReason}`);
  }

  return (
    <ScreenContainer scrollable edges={['top', 'bottom']}>
      <ScreenHeader
        title={t('petDetail.title')}
        onBack={() => router.back()}
        right={
          <IconButton
            icon={isFavorite ? 'heart' : 'heart-outline'}
            accessibilityLabel={isFavorite ? t('favorites.remove') : t('favorites.add')}
            variant="ghost"
            onPress={() => toggleFavorite.mutate({ petId: pet.id, isFavorite })}
          />
        }
      />

      <View className="flex-row items-center gap-3.5 pb-3.5">
        <PetAvatar petId={pet.id} species={pet.species} size="xl" photoUrl={pet.photos[0]} />
        <View className="flex-1">
          <View className="flex-row flex-wrap items-center gap-1.5">
            <Text variant="h2">{pet.name}</Text>
            {pet.verified && (
              <Tag label={`✓ ${t('pets.verifiedPet')}`} tone="success" size="badge" />
            )}
          </View>
          <Text variant="body" color="secondary" className="mt-0.5">
            {`${pet.breed} · ${t(`pets.gender.${pet.gender}`)} · ${t('pets.age', {
              years: age.years,
              months: age.months,
            })}`}
          </Text>
        </View>
      </View>

      {!eligible && (
        <View className="pb-3.5">
          <Notice tone="error" message={t('pets.breedingIneligible')} />
        </View>
      )}

      {!!pet.description && (
        <Text variant="body" className="pb-3.5 leading-[21px]">
          {pet.description}
        </Text>
      )}

      <Card variant="surface">
        <DetailRow
          label={t('petDetail.healthTitle')}
          value={
            pet.vaccinationUpToDate
              ? t('pets.vaccinationValue.upToDate')
              : t('pets.vaccinationValue.notConfirmed')
          }
          divider
        />
        {pet.lastVetCheckup && (
          <DetailRow label={t('petDetail.lastVetCheckup')} value={pet.lastVetCheckup} divider />
        )}
        {pet.hipScore && <DetailRow label={t('petDetail.hipScore')} value={pet.hipScore} divider />}
        <DetailRow label={t('petDetail.pedigreeLabel')} value={pedigreeValue} divider />
        <DetailRow label={t('petDetail.studTermsTitle')} value={studTermsLabel} divider />
        <DetailRow label={t('petDetail.locationLabel')} value={locationValue} />
      </Card>

      {owner && <PetOwnerCard owner={owner} />}

      {blockedReason && (
        <View className="pb-3.5">
          <Notice tone="warning" message={blockedReason} />
        </View>
      )}

      <Button
        title={hasOwnPets ? t('petDetail.sendRequestAction') : t('myPets.addPet')}
        fullWidth
        disabled={hasOwnPets && !canSendRequest}
        onPress={() => (hasOwnPets ? setIsRequestOpen(true) : router.push('/pet/new'))}
      />
      <View className="pt-2">
        <Button
          title={t('petDetail.report.menuLabel')}
          variant="secondary"
          fullWidth
          onPress={() => setIsReportOpen(true)}
        />
      </View>

      <Dialog
        visible={isRequestOpen}
        onDismiss={() => setIsRequestOpen(false)}
        title={t('petDetail.requestFor', { name: pet.name })}
      >
        <SendMatchRequestForm
          recipientPet={pet}
          eligibleSenderPets={eligibleSenderPets}
          defaultSenderPetId={senderPetId}
          onSuccess={() => {
            setIsRequestOpen(false);
            router.back();
          }}
        />
      </Dialog>

      <ReportPetDialog
        visible={isReportOpen}
        onDismiss={() => setIsReportOpen(false)}
        petId={pet.id}
      />
    </ScreenContainer>
  );
}
