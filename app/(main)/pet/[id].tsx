import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import {
  EmptyState,
  IconButton,
  ListItem,
  Loading,
  Menu,
  ScreenContainer,
  Text,
} from '@/common/components';
import { PetOwnerCard } from '@/features/pets/components/PetOwnerCard';
import { ReportPetDialog } from '@/features/pets/components/ReportPetDialog';
import { SendMatchRequestForm } from '@/features/pets/components/SendMatchRequestForm';
import { StatusPill } from '@/features/pets/components/StatusPill';
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

  let pedigreeSubtitle = t('pets.pedigreeStatus.notCertified');
  if (pet.pedigreeCertified) {
    pedigreeSubtitle = pet.registrationNumber
      ? `${t('pets.pedigreeStatus.certified')} · ${pet.registrationNumber}`
      : t('pets.pedigreeStatus.certified');
  }

  let requestSection = (
    <Text variant="body" color="secondary">
      {t(`pets.matchIncompatibility.${incompatibilityReason}`)}
    </Text>
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
      <View className="mb-4 flex-row items-center justify-between gap-2">
        <View className="flex-row items-center gap-2">
          <IconButton
            icon="chevron-back"
            accessibilityLabel={t('common.back')}
            variant="ghost"
            onPress={() => router.back()}
          />
          <Text variant="h2">{pet.name}</Text>
        </View>
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
      </View>

      <ReportPetDialog
        visible={isReportOpen}
        onDismiss={() => setIsReportOpen(false)}
        petId={pet.id}
      />

      <View className="gap-4 pb-8">
        <View className="gap-2">
          <View className="flex-row flex-wrap gap-2">
            {owner?.verifiedOwner && <StatusPill label={t('pets.verifiedOwner')} tone="success" />}
            {!eligible && <StatusPill label={t('pets.breedingIneligible')} tone="warning" />}
          </View>
          <Text variant="body" color="secondary">
            {`${pet.breed} · ${t(`pets.gender.${pet.gender}`)} · ${t('pets.age', {
              years: age.years,
              months: age.months,
            })}`}
          </Text>
          {!!pet.description && <Text variant="body">{pet.description}</Text>}
        </View>

        <View className="rounded-2xl border border-border dark:border-border-dark">
          <ListItem
            title={t('petDetail.healthTitle')}
            subtitle={
              pet.vaccinationUpToDate
                ? t('pets.vaccinationStatus.upToDate')
                : t('pets.vaccinationStatus.notConfirmed')
            }
            divider
          />
          <ListItem title={t('petDetail.pedigreeLabel')} subtitle={pedigreeSubtitle} divider />
          <ListItem title={t('petDetail.studTermsTitle')} subtitle={studTermsLabel} />
        </View>

        {owner && <PetOwnerCard owner={owner} ratings={ownerRatings ?? []} />}

        {requestSection}
      </View>
    </ScreenContainer>
  );
}
