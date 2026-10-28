import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import {
  Button,
  Card,
  DetailRow,
  Loading,
  ScreenContainer,
  ScreenHeader,
  Tag,
  Text,
} from '@/common/components';
import { signOut } from '@/features/auth/services/authService';
import { OwnerAvatar } from '@/features/pets/components/OwnerAvatar';
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
    <ScreenContainer scrollable withTabBar>
      <ScreenHeader title={t('profile.title')} />

      <View className="gap-4">
        <Card variant="surface">
          <View className="flex-row items-center gap-3">
            <OwnerAvatar ownerId={profile.id} name={profile.name} size="lg" />
            <View className="flex-1 gap-1">
              <Text variant="title">{profile.name}</Text>
              <Text variant="bodySmall" color="secondary">
                {profile.city}
              </Text>
              <Tag
                label={
                  profile.verifiedOwner ? t('pets.verifiedOwner') : t('profile.notVerifiedLabel')
                }
                tone={profile.verifiedOwner ? 'success' : 'neutral'}
              />
            </View>
          </View>
        </Card>

        <Card variant="surface">
          <DetailRow
            label={t('profile.ratingSummaryTitle')}
            value={
              profile.ratingCount > 0
                ? t('petDetail.ratingSummary', {
                    average: profile.ratingAvg.toFixed(1),
                    count: profile.ratingCount,
                  })
                : t('petDetail.noRatingsYet')
            }
            divider
          />
          <DetailRow label={t('profile.petsListedLabel')} value={`${myPets?.length ?? 0}`} />
        </Card>

        <Card variant="surface">
          <View className="gap-3">
            <Text variant="title">{t('profile.editTitle')}</Text>
            <ProfileForm profile={profile} />
          </View>
        </Card>

        <Button
          title={t('profile.savedPetsAction')}
          variant="secondary"
          fullWidth
          onPress={() => router.push('/favorites')}
        />

        <Button
          title={t('profile.viewMyPetsAction')}
          variant="secondary"
          fullWidth
          onPress={() => router.push('/my-pets')}
        />

        <View className="gap-3 pb-4">
          <Button
            title={t('profile.signOutAction')}
            variant="outline"
            fullWidth
            onPress={signOut}
          />
          <Button
            title={t('profile.deleteAccountAction')}
            variant="ghost"
            fullWidth
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
