import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import {
  Button,
  Chip,
  EmptyState,
  Input,
  Loading,
  Notice,
  ResponsiveList,
  ScreenContainer,
  ScreenHeader,
  SearchBar,
  SegmentedControl,
  Select,
  Text,
} from '@/common/components';
import { PetCard } from '@/features/pets/components/PetCard';
import { useMyPets, useNearbyPets } from '@/features/pets/hooks/usePets';
import { isBreedingEligible } from '@/features/pets/utils/breedingEligibility';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

const RADIUS_OPTIONS_KM = [2, 5, 10, 25, 50];
const DEFAULT_RADIUS_KM = 10;

export default function DiscoverTab() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: myPets, isLoading: isMyPetsLoading } = useMyPets();
  const location = useCurrentLocation();
  const [matchingForPetId, setMatchingForPetId] = useState<string | undefined>(undefined);
  const [breedQuery, setBreedQuery] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [vaccinatedOnly, setVaccinatedOnly] = useState(false);
  const [radiusKm, setRadiusKm] = useState(DEFAULT_RADIUS_KM);
  const [cityQuery, setCityQuery] = useState('');
  const debouncedBreed = useDebouncedValue(breedQuery);

  const { request: requestLocation } = location;
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  const eligibleOwnPets = useMemo(
    () => (myPets ?? []).filter((pet) => pet.availableForMatching && isBreedingEligible(pet)),
    [myPets]
  );

  const matchingForPet =
    eligibleOwnPets.find((pet) => pet.id === matchingForPetId) ?? eligibleOwnPets[0];

  const nearby = useNearbyPets(
    location.coordinates && matchingForPet
      ? {
          lat: location.coordinates.lat,
          lng: location.coordinates.lng,
          radiusKm,
          myPetId: matchingForPet.id,
          breed: debouncedBreed,
          verifiedOnly,
          vaccinatedOnly,
        }
      : undefined
  );

  const results = useMemo(() => nearby.data?.pages.flat() ?? [], [nearby.data]);

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

  const needsLocation = !location.coordinates && location.status !== 'loading';
  if (needsLocation) {
    return (
      <ScreenContainer contentWidth="wide">
        {header}
        <View className="gap-3">
          <Notice
            tone="warning"
            message={
              location.status === 'denied'
                ? t('discover.locationDenied')
                : t('discover.locationUnavailable')
            }
          />
          <Input
            value={cityQuery}
            onChangeText={setCityQuery}
            placeholder={t('discover.cityPlaceholder')}
            autoCapitalize="words"
          />
          <Button
            title={t('discover.searchCityAction')}
            fullWidth
            disabled={!cityQuery.trim()}
            onPress={() => location.setFromCity(cityQuery)}
          />
          <Button
            title={t('discover.retryLocationAction')}
            variant="outline"
            fullWidth
            onPress={() => location.request()}
          />
        </View>
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

      <View className="gap-2 pb-3">
        <Text variant="label" color="secondary">
          {t('discover.radiusLabel')}
        </Text>
        <SegmentedControl
          value={String(radiusKm)}
          onChange={(next) => setRadiusKm(Number(next))}
          options={RADIUS_OPTIONS_KM.map((km) => ({
            label: t('discover.radiusOption', { km }),
            value: String(km),
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

      <View className="flex-row flex-wrap gap-2 pb-2">
        <Chip
          label={t('discover.verifiedOnlyLabel')}
          selected={verifiedOnly}
          onPress={() => setVerifiedOnly((prev) => !prev)}
        />
        <Chip
          label={t('discover.vaccinatedOnlyLabel')}
          selected={vaccinatedOnly}
          onPress={() => setVaccinatedOnly((prev) => !prev)}
        />
      </View>

      <Text variant="caption" color="muted" className="pb-3">
        {t('discover.approximateNote')}
      </Text>

      {nearby.isError && <Notice tone="error" message={t('errors.generic')} />}

      {nearby.isLoading || location.status === 'loading' ? (
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
          onEndReached={() => {
            if (nearby.hasNextPage && !nearby.isFetchingNextPage) nearby.fetchNextPage();
          }}
          footerComponent={nearby.isFetchingNextPage ? <Loading /> : undefined}
          emptyComponent={
            <EmptyState title={t('discover.emptyTitle')} message={t('discover.emptyMessage')} />
          }
        />
      )}
    </ScreenContainer>
  );
}
