import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import {
  Button,
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
  Switch,
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
      <ScreenContainer contentWidth="wide" edges={[]}>
        {header}
        <Loading />
      </ScreenContainer>
    );
  }

  if (!matchingForPet) {
    return (
      <ScreenContainer contentWidth="wide" edges={[]}>
        {header}
        <EmptyState
          glyph="🐕"
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
      <ScreenContainer contentWidth="wide" edges={[]}>
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

  const isLoading = nearby.isLoading || location.status === 'loading';

  const listHeader = (
    <View>
      {header}

      <View className="gap-3 pb-3.5">
        <Select
          label={t('discover.matchingForLabel')}
          value={matchingForPet.id}
          onChange={setMatchingForPetId}
          options={eligibleOwnPets.map((pet) => ({
            label: `${pet.name} — ${pet.breed} (${t(`pets.gender.${pet.gender}`)})`,
            value: pet.id,
          }))}
        />

        <View className="gap-1.5">
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

        <SearchBar
          value={breedQuery}
          onChangeText={setBreedQuery}
          placeholder={t('discover.searchPlaceholder')}
        />
      </View>

      <View className="pb-2">
        <Switch
          label={t('discover.verifiedOnlyLabel')}
          value={verifiedOnly}
          onValueChange={setVerifiedOnly}
        />
        <Switch
          label={t('discover.vaccinatedOnlyLabel')}
          value={vaccinatedOnly}
          onValueChange={setVaccinatedOnly}
        />
      </View>

      <Text variant="caption" color="muted" className="pb-3">
        {t('discover.approximateNote')}
      </Text>

      {nearby.isError && (
        <View className="pb-3">
          <Notice tone="error" message={t('errors.generic')} />
        </View>
      )}

      {!isLoading && results.length > 0 && (
        <Text variant="bodySmall" color="secondary" className="pb-3">
          {t('discover.resultCount', { count: results.length })}
        </Text>
      )}
    </View>
  );

  return (
    <ScreenContainer contentWidth="wide" edges={[]}>
      <ResponsiveList
        data={isLoading ? [] : results}
        keyExtractor={(pet) => pet.id}
        headerComponent={listHeader}
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
          isLoading ? (
            <Loading />
          ) : (
            <EmptyState
              glyph="🔍"
              title={t('discover.emptyTitle')}
              message={t('discover.emptyMessage')}
            />
          )
        }
      />
    </ScreenContainer>
  );
}
