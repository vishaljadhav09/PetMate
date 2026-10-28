import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Card, Tag, Text } from '@/common/components';
import { usePetOwner } from '../../hooks/usePets';
import type { Pet } from '../../types/pet.types';
import { ageLabel, isBreedingEligible } from '../../utils/breedingEligibility';
import { PetAvatar } from '../PetAvatar';
import { styles } from './PetCard.styles';

export interface PetCardProps {
  pet: Pet;
  onPress?: () => void;
}

/**
 * Summary card for a pet in lists (the prototype's .pet-card): rounded-square
 * avatar, serif name with verified badge, meta line and fact tags.
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
      <View style={styles.row}>
        <PetAvatar petId={pet.id} species={pet.species} size="lg" photoUrl={pet.photos[0]} />
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text variant="title" numberOfLines={1} style={styles.name}>
              {pet.name}
            </Text>
            {pet.verified && (
              <Tag label={`✓ ${t('pets.verifiedPet')}`} tone="success" size="badge" />
            )}
            {pet.distanceKm !== undefined && (
              <Text variant="caption" style={styles.distance}>
                {t('discover.distanceAway', { distance: pet.distanceKm })}
              </Text>
            )}
          </View>
          <Text variant="bodySmall" style={styles.meta} numberOfLines={1}>
            {meta}
          </Text>
          <View style={styles.tags}>
            <Tag label={t(`pets.gender.${pet.gender}`)} />
            <Tag
              label={
                pet.vaccinationUpToDate ? t('pets.vaccinatedShort') : t('pets.vaccinationUnclear')
              }
              tone={pet.vaccinationUpToDate ? 'success' : 'error'}
            />
            {!eligible && <Tag label={t('pets.breedingIneligible')} tone="error" />}
            {!pet.approved && <Tag label={t('pets.pendingApproval')} tone="warning" />}
            {pet.hidden && <Tag label={t('pets.hiddenListing')} tone="error" />}
          </View>
        </View>
      </View>
    </Card>
  );
}
