import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '@/providers/auth/authStore';
import { configureNotificationHandler, registerPushToken } from '../services/pushService';

configureNotificationHandler();

/**
 * Registers this device for push once the user is signed in, and opens the Requests tab when
 * a notification is tapped (including the tap that launched the app).
 */
export function usePushNotifications() {
  const router = useRouter();
  const userId = useAuthStore((s) => s.user?.id);

  useEffect(() => {
    if (!userId) return;
    registerPushToken(userId).catch(() => undefined);
  }, [userId]);

  useEffect(() => {
    const openRequests = () => router.push('/requests');

    const subscription = Notifications.addNotificationResponseReceivedListener(openRequests);

    // App was closed and opened by tapping a notification.
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) openRequests();
    });

    return () => subscription.remove();
  }, [router]);
}
