import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import {
  Card,
  DetailRow,
  EmptyState,
  IconButton,
  Loading,
  Menu,
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
import { useMyPets, usePet, usePetOwner } from '@/features/pets/hooks/usePets';
import { useRatingsForUser } from '@/features/pets/hooks/useRatings';
import { ageLabel, isBreedingEligible } from '@/features/pets/utils/breedingEligibility';
import { getMatchIncompatibilityReason } from '@/features/pets/utils/matchCompatibility';

export default function PetDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id, senderPetId } = useLocalSearchParams<{ id: string; senderPetId?: string }>();
  const { data: pet, isLoading: isPetLoading } = usePet(id);
  const ownerId = pet?.ownerId ?? '';
  const { data: owner } = usePetOwner(ownerId);
  const { data: ownerRatings } = useRatingsForUser(ownerId);
  const { data: myPets } = useMyPets();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  if (isPetLoading || !pet) {
    return (
      <ScreenContainer>
        <Loading fullScreen />
      </ScreenContainer>
    );
  }

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
      ? `${pet.city} · ${t('discover.distanceAway', { distance: pet.distanceKm })}`
      : pet.city;

  let requestSection = (
    <Notice tone="warning" message={t(`pets.matchIncompatibility.${incompatibilityReason}`)} />
  );
  if (!myPets || myPets.length === 0) {
    requestSection = (
      <EmptyState
        title={t('petDetail.noOwnPetTitle')}
        message={t('petDetail.noOwnPetMessage')}
        actionLabel={t('myPets.addPet')}
        onAction={() => router.push('/pet/new')}
      />
    );
  } else if (eligibleSenderPets.length > 0) {
    requestSection = (
      <SendMatchRequestForm
        recipientPet={pet}
        eligibleSenderPets={eligibleSenderPets}
        defaultSenderPetId={senderPetId}
        onSuccess={() => router.back()}
      />
    );
  }

  return (
    <ScreenContainer scrollable>
      <ScreenHeader
        title={pet.name}
        onBack={() => router.back()}
        right={
          <Menu
            visible={isMenuOpen}
            onDismiss={() => setIsMenuOpen(false)}
            anchor={
              <IconButton
                icon="ellipsis-vertical"
                accessibilityLabel={t('petDetail.report.menuLabel')}
                variant="ghost"
                onPress={() => setIsMenuOpen(true)}
              />
            }
            items={[
              {
                label: t('petDetail.report.menuLabel'),
                icon: 'flag-outline',
                destructive: true,
                onPress: () => setIsReportOpen(true),
              },
            ]}
          />
        }
      />

      <ReportPetDialog
        visible={isReportOpen}
        onDismiss={() => setIsReportOpen(false)}
        petId={pet.id}
      />

      <View className="gap-4 pb-8">
        <View className="flex-row items-center gap-4">
          <PetAvatar petId={pet.id} species={pet.species} size="xl" photoUrl={pet.photos[0]} />
          <View className="flex-1 gap-2">
            <Text variant="bodySmall" color="secondary">
              {`${pet.breed} · ${t(`pets.gender.${pet.gender}`)} · ${t('pets.age', {
                years: age.years,
                months: age.months,
              })}`}
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {pet.verified && <Tag label={t('pets.verifiedPet')} tone="success" />}
              {owner?.verifiedOwner && <Tag label={t('pets.verifiedOwner')} tone="success" />}
              <Tag
                label={
                  pet.vaccinationUpToDate ? t('pets.vaccinatedShort') : t('pets.vaccinationUnclear')
                }
                tone={pet.vaccinationUpToDate ? 'success' : 'warning'}
              />
            </View>
          </View>
        </View>

        {!eligible && <Notice tone="error" message={t('pets.breedingIneligible')} />}

        {!!pet.description && <Text variant="body">{pet.description}</Text>}

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
          <DetailRow label={t('petDetail.pedigreeLabel')} value={pedigreeValue} divider />
          <DetailRow label={t('petDetail.studTermsTitle')} value={studTermsLabel} divider />
          <DetailRow label={t('petDetail.locationLabel')} value={locationValue} />
        </Card>

        {owner && <PetOwnerCard owner={owner} ratings={ownerRatings ?? []} />}

        {requestSection}
      </View>
    </ScreenContainer>
  );
}
