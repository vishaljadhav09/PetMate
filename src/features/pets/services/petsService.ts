import { supabase } from '@/integrations/supabase';
import type { CreatePetData, Pet, PetFilters, PetOwner, UpdatePetData } from '../types';
import { mapPetRow, toPetInsert, toPetUpdate } from '../utils/petMapper';

function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add the Supabase env vars to .env.');
  }
  return supabase;
}

export async function fetchPets(filters: PetFilters = {}): Promise<Pet[]> {
  const client = requireSupabase();

  let query = client.from('pets').select('*, owner:profiles!inner(verified_owner)');
  if (filters.ownerId) query = query.eq('owner_id', filters.ownerId);
  if (filters.excludeOwnerId) query = query.neq('owner_id', filters.excludeOwnerId);
  if (filters.species) query = query.eq('species', filters.species);
  if (filters.gender) query = query.eq('gender', filters.gender);
  if (filters.breedQuery?.trim()) query = query.ilike('breed', `%${filters.breedQuery.trim()}%`);
  if (filters.verifiedOnly) query = query.eq('owner.verified_owner', true);

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(mapPetRow);
}

export async function fetchPetById(id: string): Promise<Pet> {
  const client = requireSupabase();
  const { data, error } = await client.from('pets').select('*').eq('id', id).single();
  if (error) throw error;
  return mapPetRow(data);
}

export async function createPet(data: CreatePetData): Promise<Pet> {
  const client = requireSupabase();
  const { data: row, error } = await client
    .from('pets')
    .insert(toPetInsert(data))
    .select()
    .single();
  if (error) throw error;
  return mapPetRow(row);
}

export async function updatePet(id: string, data: UpdatePetData): Promise<Pet> {
  const client = requireSupabase();
  const { data: row, error } = await client
    .from('pets')
    .update(toPetUpdate(data))
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return mapPetRow(row);
}

/** Public owner info. The phone stays empty: it is only revealed after a request is accepted. */
export async function fetchPetOwner(ownerId: string): Promise<PetOwner> {
  const client = requireSupabase();
  const { data, error } = await client
    .from('profiles')
    .select('id, name, city, verified_owner')
    .eq('id', ownerId)
    .single();
  if (error) throw error;
  return {
    id: data.id,
    name: data.name,
    phone: '',
    city: data.city ?? '',
    verifiedOwner: data.verified_owner,
  };
}
