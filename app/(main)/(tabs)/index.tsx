import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, View } from 'react-native';
import {
  Chip,
  EmptyState,
  Loading,
  ScreenContainer,
  SearchBar,
  Select,
  Text,
} from '@/common/components';
import { PetCard } from '@/features/pets/components/PetCard';
import { useMyPets, usePets } from '@/features/pets/hooks/usePets';
import { MOCK_CURRENT_USER_ID } from '@/features/pets/services/mockDb';
import type { Pet, PetGender } from '@/features/pets/types';
import { isBreedingEligible } from '@/features/pets/utils/breedingEligibility';

function oppositeGenderOf(gender: PetGender): PetGender {
  return gender === 'male' ? 'female' : 'male';
}

export default function DiscoverTab() {
  const { t } = useTranslation();
  const router = useRouter();
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
          excludeOwnerId: MOCK_CURRENT_USER_ID,
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

  const header = (
    <View className="gap-1 pb-4">
      <Text variant="h1">{t('discover.title')}</Text>
      <Text variant="body" color="secondary">
        {t('discover.subtitle')}
      </Text>
    </View>
  );

  if (isMyPetsLoading) {
    return (
      <ScreenContainer>
        {header}
        <Loading />
      </ScreenContainer>
    );
  }

  if (!matchingForPet) {
    return (
      <ScreenContainer>
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
    <ScreenContainer>
      {header}

      <View className="gap-2 pb-3">
        <Text variant="label">{t('discover.matchingForLabel')}</Text>
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

      <View className="flex-row pb-3">
        <Chip
          label={t('discover.verifiedOnlyLabel')}
          selected={verifiedOnly}
          onPress={() => setVerifiedOnly((prev) => !prev)}
        />
      </View>

      {isCandidatesLoading ? (
        <Loading />
      ) : (
        <FlatList<Pet>
          className="flex-1"
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PetCard
              pet={item}
              onPress={() =>
                router.push({
                  pathname: '/pet/[id]',
                  params: { id: item.id, senderPetId: matchingForPet.id },
                })
              }
            />
          )}
          contentContainerClassName="gap-3 pb-6"
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState title={t('discover.emptyTitle')} message={t('discover.emptyMessage')} />
          }
        />
      )}
    </ScreenContainer>
  );
}
