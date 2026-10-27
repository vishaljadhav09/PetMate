import { supabase } from '@/integrations/supabase';
import type { MyProfile, UpdateProfileData } from '../types';

function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add the Supabase env vars to .env.');
  }
  return supabase;
}

export async function fetchMyProfile(userId: string): Promise<MyProfile> {
  const client = requireSupabase();

  const [profileResult, privateResult] = await Promise.all([
    client
      .from('profiles')
      .select('id, name, city, rating_avg, rating_count, verified_owner')
      .eq('id', userId)
      .single(),
    client.from('profile_private').select('phone').eq('id', userId).single(),
  ]);

  if (profileResult.error) throw profileResult.error;
  if (privateResult.error) throw privateResult.error;

  const profile = profileResult.data;
  return {
    id: profile.id,
    name: profile.name,
    city: profile.city ?? '',
    phone: privateResult.data.phone ?? '',
    verifiedOwner: profile.verified_owner,
    ratingAvg: profile.rating_avg,
    ratingCount: profile.rating_count,
  };
}

export async function updateMyProfile(userId: string, data: UpdateProfileData): Promise<void> {
  const client = requireSupabase();

  const { error: profileError } = await client
    .from('profiles')
    .update({ name: data.name.trim(), city: data.city.trim() || null })
    .eq('id', userId);
  if (profileError) throw profileError;

  const { error: privateError } = await client
    .from('profile_private')
    .update({ phone: data.phone.trim() || null })
    .eq('id', userId);
  if (privateError) throw privateError;
}
