import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin';
import { env } from '@/config/env';
import { supabase } from '@/integrations/supabase';

let isGoogleConfigured = false;

function configureGoogle() {
  if (isGoogleConfigured) return;
  GoogleSignin.configure({ webClientId: env.googleWebClientId });
  isGoogleConfigured = true;
}

function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add the Supabase env vars to .env.');
  }
  return supabase;
}

/**
 * Signs in with Google and exchanges the ID token for a Supabase session.
 * Returns `false` when the user dismisses the Google dialog.
 */
export async function signInWithGoogle(): Promise<boolean> {
  const client = requireSupabase();
  configureGoogle();

  await GoogleSignin.hasPlayServices();
  const response = await GoogleSignin.signIn();
  if (!isSuccessResponse(response)) return false;

  const idToken = response.data.idToken;
  if (!idToken) throw new Error('Google did not return an ID token');

  const { error } = await client.auth.signInWithIdToken({ provider: 'google', token: idToken });
  if (error) throw error;
  return true;
}

export async function signOut(): Promise<void> {
  configureGoogle();
  await GoogleSignin.signOut().catch(() => undefined);
  if (supabase) await supabase.auth.signOut();
}

export async function deleteMyAccount(): Promise<void> {
  const client = requireSupabase();
  const { error } = await client.functions.invoke('delete-account');
  if (error) throw error;
  await signOut();
}
