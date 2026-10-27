import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Avatar, Button, Loading, ScreenContainer, Text } from '@/common/components';
import { signOut } from '@/features/auth/services/authService';
import { RatingStars } from '@/features/pets/components/RatingStars';
import { StatusPill } from '@/features/pets/components/StatusPill';
import { useMyPets } from '@/features/pets/hooks/usePets';
import { DeleteAccountDialog } from '@/features/profile/components/DeleteAccountDialog';
import { ProfileForm } from '@/features/profile/components/ProfileForm';
import { useMyProfile } from '@/features/profile/hooks/useProfile';

export default function ProfileTab() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: profile, isLoading: isProfileLoading } = useMyProfile();
  const { data: myPets } = useMyPets();
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);

  if (isProfileLoading || !profile) {
    return (
      <ScreenContainer>
        <Loading fullScreen />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable>
      <View className="gap-1 pb-4">
        <Text variant="h1">{t('profile.title')}</Text>
      </View>

      <View className="gap-4">
        <View className="flex-row items-center gap-3 rounded-2xl border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark">
          <Avatar initials={profile.name.slice(0, 2).toUpperCase()} size="lg" />
          <View className="flex-1 gap-1">
            <View className="flex-row flex-wrap items-center gap-2">
              <Text variant="label" weight="semibold">
                {profile.name}
              </Text>
              {profile.verifiedOwner ? (
                <StatusPill label={t('pets.verifiedOwner')} tone="success" />
              ) : (
                <StatusPill label={t('profile.notVerifiedLabel')} tone="neutral" />
              )}
            </View>
            <Text variant="bodySmall" color="secondary">
              {profile.city}
            </Text>
          </View>
        </View>

        <View className="gap-2 rounded-2xl border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark">
          <Text variant="label" weight="semibold">
            {t('profile.ratingSummaryTitle')}
          </Text>
          <View className="flex-row items-center gap-2">
            <RatingStars value={profile.ratingAvg} />
            <Text variant="bodySmall" color="secondary">
              {profile.ratingCount > 0
                ? t('petDetail.ratingSummary', {
                    average: profile.ratingAvg.toFixed(1),
                    count: profile.ratingCount,
                  })
                : t('petDetail.noRatingsYet')}
            </Text>
          </View>
        </View>

        <View className="gap-3 rounded-2xl border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark">
          <Text variant="label" weight="semibold">
            {t('profile.editTitle')}
          </Text>
          <ProfileForm profile={profile} />
        </View>

        <View className="gap-3 rounded-2xl border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark">
          <Text variant="body" color="secondary">
            {t('profile.petsCountLabel', { count: myPets?.length ?? 0 })}
          </Text>
          <Button
            title={t('profile.viewMyPetsAction')}
            variant="secondary"
            onPress={() => router.push('/my-pets')}
          />
        </View>

        <View className="gap-3 pb-4">
          <Button title={t('profile.signOutAction')} variant="outline" onPress={signOut} />
          <Button
            title={t('profile.deleteAccountAction')}
            variant="ghost"
            onPress={() => setIsDeleteDialogVisible(true)}
          />
        </View>
      </View>

      <DeleteAccountDialog
        visible={isDeleteDialogVisible}
        onDismiss={() => setIsDeleteDialogVisible(false)}
      />
    </ScreenContainer>
  );
}
