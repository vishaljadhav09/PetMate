import { supabase } from '@/integrations/supabase';

function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add the Supabase env vars to .env.');
  }
  return supabase;
}

/** Ids of the pets the signed-in user saved. Favorites are private to their owner. */
export async function fetchFavoritePetIds(): Promise<string[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from('favorites')
    .select('pet_id')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map((row) => row.pet_id);
}

export async function addFavorite(petId: string): Promise<void> {
  const client = requireSupabase();
  const { error } = await client.from('favorites').insert({ pet_id: petId });
  if (error) throw error;
}

export async function removeFavorite(petId: string): Promise<void> {
  const client = requireSupabase();
  const { error } = await client.from('favorites').delete().eq('pet_id', petId);
  if (error) throw error;
}
