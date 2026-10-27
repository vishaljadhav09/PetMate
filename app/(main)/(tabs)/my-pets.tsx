import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Button, EmptyState, Loading, ScreenContainer, Text } from '@/common/components';
import { PetCard } from '@/features/pets/components/PetCard';
import { useMyPets } from '@/features/pets/hooks/usePets';

export default function MyPetsTab() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: pets, isLoading } = useMyPets();

  return (
    <ScreenContainer scrollable>
      <View className="gap-1 pb-4">
        <Text variant="h1">{t('myPets.title')}</Text>
        <Text variant="body" color="secondary">
          {t('myPets.subtitle')}
        </Text>
      </View>

      {isLoading && <Loading />}

      {!isLoading && pets && pets.length > 0 && (
        <View className="gap-3 pb-4">
          {pets.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              onPress={() => router.push({ pathname: '/pet/[id]/edit', params: { id: pet.id } })}
            />
          ))}
        </View>
      )}

      {!isLoading && pets && pets.length === 0 && (
        <EmptyState
          title={t('myPets.emptyTitle')}
          message={t('myPets.emptyMessage')}
          actionLabel={t('myPets.addPet')}
          onAction={() => router.push('/pet/new')}
        />
      )}

      {!isLoading && pets && pets.length > 0 && (
        <Button
          title={t('myPets.addPet')}
          variant="secondary"
          onPress={() => router.push('/pet/new')}
        />
      )}
    </ScreenContainer>
  );
}
