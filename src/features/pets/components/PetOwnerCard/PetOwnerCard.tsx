import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Text } from '@/common/components';
import type { PetOwner } from '../../types';
import { OwnerAvatar } from '../OwnerAvatar';
import { styles } from './PetOwnerCard.styles';

const VERIFIED_MARK = ' ✓';

export interface PetOwnerCardProps {
  owner: PetOwner;
}

/** No phone number here by design — it's only revealed once a match request is accepted. */
export function PetOwnerCard({ owner }: PetOwnerCardProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.row}>
      <OwnerAvatar ownerId={owner.id} name={owner.name} size="xs" />
      <View style={styles.info}>
        <Text style={styles.name}>
          {owner.name}
          {owner.verifiedOwner && <Text style={styles.verifiedMark}>{VERIFIED_MARK}</Text>}
        </Text>
        <Text variant="bodySmall" style={styles.rating}>
          {owner.ratingCount > 0
            ? `★ ${t('petDetail.ratingSummary', {
                average: owner.ratingAverage.toFixed(1),
                count: owner.ratingCount,
              })}`
            : t('petDetail.noRatingsYet')}
        </Text>
      </View>
    </View>
  );
}
