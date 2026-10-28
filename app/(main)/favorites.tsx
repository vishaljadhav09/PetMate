import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  EmptyState,
  Loading,
  ResponsiveList,
  ScreenContainer,
  ScreenHeader,
} from '@/common/components';
import { PetCard } from '@/features/pets/components/PetCard';
import { useFavoritePetIds } from '@/features/pets/hooks/useFavorites';
import { usePets } from '@/features/pets/hooks/usePets';

export default function FavoritesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: favoriteIds, isLoading: isIdsLoading } = useFavoritePetIds();
  const hasFavorites = !!favoriteIds && favoriteIds.length > 0;
  const { data: pets, isLoading: isPetsLoading } = usePets(
    hasFavorites ? { ids: favoriteIds } : undefined
  );

  const isLoading = isIdsLoading || (hasFavorites && isPetsLoading);

  return (
    <ScreenContainer contentWidth="wide" edges={['top', 'bottom']}>
      <ScreenHeader
        title={t('favorites.title')}
        subtitle={t('favorites.subtitle')}
        onBack={() => router.back()}
      />

      {isLoading ? (
        <Loading />
      ) : (
        <ResponsiveList
          data={hasFavorites ? (pets ?? []) : []}
          keyExtractor={(pet) => pet.id}
          renderItem={(pet) => (
            <PetCard
              pet={pet}
              onPress={() => router.push({ pathname: '/pet/[id]', params: { id: pet.id } })}
            />
          )}
          withTabBar={false}
          emptyComponent={
            <EmptyState title={t('favorites.emptyTitle')} message={t('favorites.emptyMessage')} />
          }
        />
      )}
    </ScreenContainer>
  );
}
