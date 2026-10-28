import { supabase } from '@/integrations/supabase';
import type { Tables, TablesInsert } from '@/types/database';
import type { Rating } from '../types';

export interface CreateRatingData {
  matchRequestId: string;
  stars: 1 | 2 | 3 | 4 | 5;
  comment?: string;
}

function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add the Supabase env vars to .env.');
  }
  return supabase;
}

function mapRatingRow(row: Tables<'ratings'>): Rating {
  return {
    id: row.id,
    matchRequestId: row.match_request_id,
    raterUserId: row.rated_by,
    ratedUserId: row.rated_user,
    stars: row.rating as Rating['stars'],
    comment: row.comment ?? undefined,
    createdAt: row.created_at,
  };
}

export async function fetchRatingsForUser(userId: string): Promise<Rating[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from('ratings')
    .select('*')
    .eq('rated_user', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(mapRatingRow);
}

export async function fetchRatingsForMatchRequest(matchRequestId: string): Promise<Rating[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from('ratings')
    .select('*')
    .eq('match_request_id', matchRequestId);
  if (error) throw error;
  return data.map(mapRatingRow);
}

/** The database only accepts ratings for completed matches and fills in who is being rated. */
export async function createRating(data: CreateRatingData): Promise<Rating> {
  const client = requireSupabase();
  // `rated_user` is set by a trigger and clients may not write it, so it is left out.
  const payload = {
    match_request_id: data.matchRequestId,
    rating: data.stars,
    comment: data.comment ?? null,
  } as TablesInsert<'ratings'>;
  const { data: row, error } = await client.from('ratings').insert(payload).select().single();
  if (error) throw error;
  return mapRatingRow(row);
}
