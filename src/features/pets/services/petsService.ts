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

  let query = client
    .from('pets')
    .select('*, owner:profiles!pets_owner_id_fkey!inner(verified_owner)');
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
    .select('id, name, city, verified_owner, rating_avg, rating_count')
    .eq('id', ownerId)
    .single();
  if (error) throw error;
  return {
    id: data.id,
    name: data.name,
    phone: '',
    city: data.city ?? '',
    verifiedOwner: data.verified_owner,
    ratingAverage: data.rating_avg,
    ratingCount: data.rating_count,
  };
}

export const NEARBY_PAGE_SIZE = 30;

export interface NearbyArgs {
  lat: number;
  lng: number;
  radiusKm: number;
  /** The pet you are matching for. The server then enforces same species + opposite gender. */
  myPetId?: string;
  breed?: string;
  verifiedOnly?: boolean;
  vaccinatedOnly?: boolean;
  page?: number;
}

/**
 * Nearby compatible pets, nearest first. The `nearby_pets` function does the filtering and
 * distance maths on the server; a second query fetches the full pet rows for the result ids.
 */
export async function fetchNearbyPets(args: NearbyArgs): Promise<Pet[]> {
  const client = requireSupabase();
  const page = args.page ?? 0;

  const { data: nearby, error } = await client.rpc('nearby_pets', {
    p_lat: args.lat,
    p_lng: args.lng,
    p_radius_m: Math.round(args.radiusKm * 1000),
    p_my_pet_id: args.myPetId,
    p_breed: args.breed?.trim() || undefined,
    p_verified_only: args.verifiedOnly ?? false,
    p_vaccinated_only: args.vaccinatedOnly ?? false,
    p_limit: NEARBY_PAGE_SIZE,
    p_offset: page * NEARBY_PAGE_SIZE,
  });
  if (error) throw error;
  if (nearby.length === 0) return [];

  const { data: rows, error: petsError } = await client
    .from('pets')
    .select('*')
    .in(
      'id',
      nearby.map((row) => row.id)
    );
  if (petsError) throw petsError;

  const byId = new Map(rows.map((row) => [row.id, mapPetRow(row)]));
  return nearby.flatMap((row) => {
    const pet = byId.get(row.id);
    if (!pet) return [];
    return [{ ...pet, distanceKm: Number((row.distance_m / 1000).toFixed(1)) }];
  });
}
