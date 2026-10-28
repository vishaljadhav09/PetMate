import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { env } from '@/config/env';
import { supabase } from '@/integrations/supabase';

const ANDROID_CHANNEL_ID = 'default';

/** Show alerts while the app is open too, not only in the background. */
export function configureNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

function getProjectId(): string | undefined {
  const fromConfig = (Constants.expoConfig?.extra?.eas as { projectId?: string } | undefined)
    ?.projectId;
  return env.easProjectId || fromConfig;
}

/**
 * Asks for permission, reads this device's Expo push token and saves it on the user's private
 * profile so the `send-push` function can reach them. Returns the token, or `null` when push
 * is unavailable (simulator, permission denied, missing project id).
 */
export async function registerPushToken(userId: string): Promise<string | null> {
  if (!supabase || !Device.isDevice) return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
      name: 'PetMate',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  let { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    status = (await Notifications.requestPermissionsAsync()).status;
  }
  if (status !== 'granted') return null;

  const projectId = getProjectId();
  if (!projectId) return null;

  const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
  const { error } = await supabase
    .from('profile_private')
    .update({ push_token: token })
    .eq('id', userId);
  if (error) throw error;
  return token;
}

/** Stops pushes to this account on this device. Call before signing out. */
export async function clearPushToken(userId: string): Promise<void> {
  if (!supabase) return;
  await supabase.from('profile_private').update({ push_token: null }).eq('id', userId);
}
