import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Avatar, Text } from '@/common/components';
import type { PetOwner, Rating } from '../../types';
import { getRatingSummary } from '../../utils/ratingSummary';
import { RatingStars } from '../RatingStars';
import { StatusPill } from '../StatusPill';

export interface PetOwnerCardProps {
  owner: PetOwner;
  ratings: Rating[];
}

/** No phone number here by design — it's only revealed once a match request is accepted. */
export function PetOwnerCard({ owner, ratings }: PetOwnerCardProps) {
  const { t } = useTranslation();
  const summary = getRatingSummary(ratings);

  return (
    <View className="flex-row items-center gap-3 rounded-2xl border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark">
      <Avatar initials={owner.name.slice(0, 2).toUpperCase()} size="md" />
      <View className="flex-1 gap-1">
        <View className="flex-row flex-wrap items-center gap-2">
          <Text variant="label" weight="semibold">
            {owner.name}
          </Text>
          {owner.verifiedOwner && <StatusPill label={t('pets.verifiedOwner')} tone="success" />}
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
  );
}
