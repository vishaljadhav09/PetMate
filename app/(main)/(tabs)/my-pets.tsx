import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import {
  Button,
  EmptyState,
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
  const hasPets = !!pets && pets.length > 0;

  return (
    <ScreenContainer contentWidth="wide">
      <ScreenHeader title={t('myPets.title')} subtitle={t('myPets.subtitle')} />

      {isLoading && <Loading />}

      {!isLoading && hasPets && (
        <View className="pb-4">
          <Button
            title={t('myPets.addPet')}
            variant="primary"
            fullWidth
            onPress={() => router.push('/pet/new')}
          />
        </View>
      )}

      {!isLoading && pets && (
        <ResponsiveList
          data={pets}
          keyExtractor={(pet) => pet.id}
          renderItem={(pet) => (
            <PetCard
              pet={pet}
              onPress={() => router.push({ pathname: '/pet/[id]/edit', params: { id: pet.id } })}
            />
          )}
          emptyComponent={
            <EmptyState
              title={t('myPets.emptyTitle')}
              message={t('myPets.emptyMessage')}
              actionLabel={t('myPets.addPet')}
              onAction={() => router.push('/pet/new')}
            />
          }
        />
      )}
    </ScreenContainer>
  );
}
