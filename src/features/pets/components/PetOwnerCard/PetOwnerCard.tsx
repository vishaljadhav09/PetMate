import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Card, Tag, Text } from '@/common/components';
import type { PetOwner } from '../../types';
import { OwnerAvatar } from '../OwnerAvatar';
import { RatingStars } from '../RatingStars';

export interface PetOwnerCardProps {
  owner: PetOwner;
}

/** No phone number here by design — it's only revealed once a match request is accepted. */
export function PetOwnerCard({ owner }: PetOwnerCardProps) {
  const { t } = useTranslation();

  return (
    <Card variant="surface">
      <View className="flex-row items-center gap-3">
        <OwnerAvatar ownerId={owner.id} name={owner.name} size="md" />
        <View className="flex-1 gap-1">
          <View className="flex-row flex-wrap items-center gap-2">
            <Text variant="label">{owner.name}</Text>
            {owner.verifiedOwner && <Tag label={t('pets.verifiedOwner')} tone="success" />}
          </View>
          <Text variant="bodySmall" color="secondary">
            {owner.city}
          </Text>
          <View className="flex-row items-center gap-2">
            <RatingStars value={owner.ratingAverage} size={14} />
            <Text variant="caption" color="muted">
              {owner.ratingCount > 0
                ? t('petDetail.ratingSummary', {
                    average: owner.ratingAverage.toFixed(1),
                    count: owner.ratingCount,
                  })
                : t('petDetail.noRatingsYet')}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
}
