import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';
import { Button, ScreenContainer, Text } from '@/common/components';
import { signInWithGoogle } from '@/features/auth/services/authService';

export default function LoginScreen() {
  const { t } = useTranslation();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
    } catch {
      Toast.show({ type: 'error', text1: t('auth.signInFailed') });
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <ScreenContainer>
      <View className="flex-1 justify-center gap-8">
        <View className="gap-2">
          <Text variant="h1">{t('auth.welcomeTitle')}</Text>
          <Text variant="body" color="secondary">
            {t('auth.welcomeSubtitle')}
          </Text>
        </View>
        <Button
          title={t('auth.continueWithGoogle')}
          fullWidth
          loading={isSigningIn}
          onPress={handleGoogleSignIn}
        />
      </View>
    </ScreenContainer>
  );
}
