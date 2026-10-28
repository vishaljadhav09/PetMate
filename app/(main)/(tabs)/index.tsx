import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import {
  Chip,
  EmptyState,
  Loading,
  ResponsiveList,
  ScreenContainer,
  ScreenHeader,
  SearchBar,
  Select,
  Text,
} from '@/common/components';
import { PetCard } from '@/features/pets/components/PetCard';
import { useMyPets, usePets } from '@/features/pets/hooks/usePets';
import type { PetGender } from '@/features/pets/types';
import { isBreedingEligible } from '@/features/pets/utils/breedingEligibility';
import { useAuthStore } from '@/providers/auth/authStore';

function oppositeGenderOf(gender: PetGender): PetGender {
  return gender === 'male' ? 'female' : 'male';
}

export default function DiscoverTab() {
  const { t } = useTranslation();
  const router = useRouter();
  const userId = useAuthStore((s) => s.user?.id);
  const { data: myPets, isLoading: isMyPetsLoading } = useMyPets();
  const [matchingForPetId, setMatchingForPetId] = useState<string | undefined>(undefined);
  const [breedQuery, setBreedQuery] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const eligibleOwnPets = useMemo(
    () => (myPets ?? []).filter((pet) => pet.availableForMatching && isBreedingEligible(pet)),
    [myPets]
  );

  const matchingForPet =
    eligibleOwnPets.find((pet) => pet.id === matchingForPetId) ?? eligibleOwnPets[0];

  const { data: candidates, isLoading: isCandidatesLoading } = usePets(
    matchingForPet
      ? {
          species: matchingForPet.species,
          gender: oppositeGenderOf(matchingForPet.gender),
          excludeOwnerId: userId,
          breedQuery,
          verifiedOnly,
        }
      : undefined
  );

  const results = useMemo(
    () =>
      (candidates ?? [])
        .filter((pet) => pet.availableForMatching && isBreedingEligible(pet))
        .sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity)),
    [candidates]
  );

  const header = <ScreenHeader title={t('discover.title')} subtitle={t('discover.subtitle')} />;

  if (isMyPetsLoading) {
    return (
      <ScreenContainer contentWidth="wide">
        {header}
        <Loading />
      </ScreenContainer>
    );
  }

  if (!matchingForPet) {
    return (
      <ScreenContainer contentWidth="wide">
        {header}
        <EmptyState
          title={t('discover.noEligiblePetsTitle')}
          message={t('discover.noEligiblePetsMessage')}
          actionLabel={t('myPets.addPet')}
          onAction={() => router.push('/pet/new')}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer contentWidth="wide">
      {header}

      <View className="gap-2 pb-3">
        <Text variant="label" color="secondary">
          {t('discover.matchingForLabel')}
        </Text>
        <Select
          value={matchingForPet.id}
          onChange={setMatchingForPetId}
          options={eligibleOwnPets.map((pet) => ({
            label: `${pet.name} — ${pet.breed} (${t(`pets.gender.${pet.gender}`)})`,
            value: pet.id,
          }))}
        />
      </View>

      <View className="pb-3">
        <SearchBar
          value={breedQuery}
          onChangeText={setBreedQuery}
          placeholder={t('discover.searchPlaceholder')}
        />
      </View>

      <View className="flex-row pb-4">
        <Chip
          label={t('discover.verifiedOnlyLabel')}
          selected={verifiedOnly}
          onPress={() => setVerifiedOnly((prev) => !prev)}
        />
      </View>

      {isCandidatesLoading ? (
        <Loading />
      ) : (
        <ResponsiveList
          data={results}
          keyExtractor={(pet) => pet.id}
          renderItem={(pet) => (
            <PetCard
              pet={pet}
              onPress={() =>
                router.push({
                  pathname: '/pet/[id]',
                  params: { id: pet.id, senderPetId: matchingForPet.id },
                })
              }
            />
          )}
          emptyComponent={
            <EmptyState title={t('discover.emptyTitle')} message={t('discover.emptyMessage')} />
          }
        />
      )}
    </ScreenContainer>
  );
}
