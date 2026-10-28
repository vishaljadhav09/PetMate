import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  EmptyState,
  FloatingActionButton,
  Loading,
  ResponsiveList,
  ScreenContainer,
  ScreenHeader,
} from '@/common/components';
import { PetCard } from '@/features/pets/components/PetCard';
import { useMyPets } from '@/features/pets/hooks/usePets';

export default function MyPetsTab() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: pets, isLoading } = useMyPets();

  return (
    <ScreenContainer contentWidth="wide" edges={[]}>
      <ResponsiveList
        data={pets ?? []}
        keyExtractor={(pet) => pet.id}
        headerComponent={<ScreenHeader title={t('myPets.title')} subtitle={t('myPets.subtitle')} />}
        renderItem={(pet) => (
          <PetCard
            pet={pet}
            onPress={() => router.push({ pathname: '/pet/[id]/edit', params: { id: pet.id } })}
          />
        )}
        emptyComponent={
          isLoading ? (
            <Loading />
          ) : (
            <EmptyState
              glyph="🐾"
              title={t('myPets.emptyTitle')}
              message={t('myPets.emptyMessage')}
            />
          )
        }
      />
      <FloatingActionButton
        accessibilityLabel={t('myPets.addPet')}
        onPress={() => router.push('/pet/new')}
      />
    </ScreenContainer>
  );
}
