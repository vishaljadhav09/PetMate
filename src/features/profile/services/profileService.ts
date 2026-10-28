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
    client
      .from('profile_private')
      .select('phone, address_line, state, pincode, lat, lng')
      .eq('id', userId)
      .single(),
  ]);

  if (profileResult.error) throw profileResult.error;
  if (privateResult.error) throw privateResult.error;

  const profile = profileResult.data;
  const { lat, lng } = privateResult.data;
  return {
    id: profile.id,
    name: profile.name,
    city: profile.city ?? '',
    phone: privateResult.data.phone ?? '',
    addressLine: privateResult.data.address_line ?? '',
    state: privateResult.data.state ?? '',
    pincode: privateResult.data.pincode ?? '',
    homeLocation: lat !== null && lng !== null ? { lat, lng } : undefined,
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
    .update({
      phone: data.phone.trim() || null,
      address_line: data.addressLine.trim() || null,
      state: data.state.trim() || null,
      pincode: data.pincode.trim() || null,
      ...(data.homeLocation !== undefined && {
        lat: data.homeLocation?.lat ?? null,
        lng: data.homeLocation?.lng ?? null,
      }),
    })
    .eq('id', userId);
  if (privateError) throw privateError;
}
