import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Card, Tag, Text } from '@/common/components';
import { usePetOwner } from '../../hooks/usePets';
import type { Pet } from '../../types/pet.types';
import { ageLabel, isBreedingEligible } from '../../utils/breedingEligibility';
import { PetAvatar } from '../PetAvatar';

export interface PetCardProps {
  pet: Pet;
  onPress?: () => void;
}

/**
 * Summary card for a pet in lists. Layout uses NativeWind (`className`); the
 * surface, tags and fonts come from the shared components so colors stay themed.
 */
export function PetCard({ pet, onPress }: PetCardProps) {
  const { t } = useTranslation();
  const { data: owner } = usePetOwner(pet.ownerId);
  const eligible = isBreedingEligible(pet);
  const age = ageLabel(pet.dateOfBirth);
  const ownerFirstName = owner?.name.split(' ')[0];
  const meta = [pet.breed, t('pets.age', { years: age.years, months: age.months }), ownerFirstName]
    .filter(Boolean)
    .join(' · ');

  return (
    <Card variant="surface" pressable onPress={onPress} accessibilityLabel={pet.name}>
      <View className="flex-row gap-3">
        <PetAvatar petId={pet.id} species={pet.species} size="lg" />
        <View className="flex-1 gap-1">
          <View className="flex-row items-center justify-between gap-2">
            <View className="flex-1 flex-row flex-wrap items-center gap-2">
              <Text variant="title" numberOfLines={1}>
                {pet.name}
              </Text>
              {owner?.verifiedOwner && <Tag label={t('pets.verifiedOwner')} tone="success" />}
            </View>
            {pet.distanceKm !== undefined && (
              <Text variant="caption" color="muted">
                {t('discover.distanceAway', { distance: pet.distanceKm })}
              </Text>
            )}
          </View>
          <Text variant="bodySmall" color="secondary" numberOfLines={1}>
            {meta}
          </Text>
          <View className="flex-row flex-wrap gap-1.5 pt-1">
            <Tag label={t(`pets.gender.${pet.gender}`)} />
            <Tag
              label={
                pet.vaccinationUpToDate ? t('pets.vaccinatedShort') : t('pets.vaccinationUnclear')
              }
              tone={pet.vaccinationUpToDate ? 'success' : 'warning'}
            />
            {!eligible && <Tag label={t('pets.breedingIneligible')} tone="error" />}
          </View>
        </View>
      </View>
    </Card>
  );
}
