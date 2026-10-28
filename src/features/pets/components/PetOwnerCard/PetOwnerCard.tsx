import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Card, Tag, Text } from '@/common/components';
import type { PetOwner, Rating } from '../../types';
import { getRatingSummary } from '../../utils/ratingSummary';
import { OwnerAvatar } from '../OwnerAvatar';
import { RatingStars } from '../RatingStars';

export interface PetOwnerCardProps {
  owner: PetOwner;
  ratings: Rating[];
}

/** No phone number here by design — it's only revealed once a match request is accepted. */
export function PetOwnerCard({ owner, ratings }: PetOwnerCardProps) {
  const { t } = useTranslation();
  const summary = getRatingSummary(ratings);

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
            <RatingStars value={summary.average} size={14} />
            <Text variant="caption" color="muted">
              {summary.count > 0
                ? t('petDetail.ratingSummary', {
                    average: summary.average.toFixed(1),
                    count: summary.count,
                  })
                : t('petDetail.noRatingsYet')}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
}
