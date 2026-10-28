import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { Text } from '@/common/components';
import { OwnerAvatar } from '@/features/pets/components/OwnerAvatar';
import { useMyProfile } from '../../hooks/useProfile';
import { styles } from './TopBar.styles';

/** Wordmark on the left, the signed-in owner's avatar and first name on the right. */
export function TopBar() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: profile } = useMyProfile();
  const firstName = profile?.name.split(' ')[0];

  return (
    <View style={styles.container}>
      <View style={styles.wordmark}>
        <Text style={styles.wordmarkText}>
          {t('auth.brandName')}
          <Text style={[styles.wordmarkText, styles.wordmarkDot]}>.</Text>
        </Text>
      </View>
      {profile && (
        <Pressable
          onPress={() => router.navigate('/profile')}
          accessibilityRole="button"
          accessibilityLabel={t('tabs.profile')}
        >
          <View style={styles.account}>
            <OwnerAvatar ownerId={profile.id} name={profile.name} size="xs" />
            <Text style={styles.accountName}>{firstName}</Text>
          </View>
        </Pressable>
      )}
    </View>
  );
}
