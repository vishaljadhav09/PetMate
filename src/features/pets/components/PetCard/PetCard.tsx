import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { Avatar, Text } from '@/common/components';
import { usePetOwner } from '../../hooks/usePets';
import type { Pet } from '../../types/pet.types';
import { isBreedingEligible } from '../../utils/breedingEligibility';
import { StatusPill } from '../StatusPill';

export interface PetCardProps {
  pet: Pet;
  onPress?: () => void;
}

/**
 * Styled with NativeWind (`className`) rather than `react-native-unistyles` —
 * this is new PetMate-specific UI, not one of the shared `src/common/components`.
 */
export function PetCard({ pet, onPress }: PetCardProps) {
  const { t } = useTranslation();
  const { data: owner } = usePetOwner(pet.ownerId);
  const eligible = isBreedingEligible(pet);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={pet.name}
      className="flex-row items-center gap-3 rounded-2xl border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark"
    >
      <Avatar initials={pet.name.slice(0, 2).toUpperCase()} size="lg" />
      <View className="flex-1 gap-1">
        <View className="flex-row flex-wrap items-center gap-2">
          <Text variant="label" weight="semibold">
            {pet.name}
          </Text>
          {owner?.verifiedOwner && <StatusPill label={t('pets.verifiedOwner')} tone="success" />}
        </View>
        <Text variant="bodySmall" color="secondary">
          {pet.breed}
        </Text>
        <View className="flex-row flex-wrap items-center gap-2">
          {!eligible && <StatusPill label={t('pets.breedingIneligible')} tone="warning" />}
          {pet.distanceKm !== undefined && (
            <Text variant="caption" color="muted">
              {t('discover.distanceAway', { distance: pet.distanceKm })}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}
