import { supabase } from '@/integrations/supabase';
import type { Tables, TablesInsert } from '@/types/database';
import type { MatchContact, MatchRequest, MatchRequestStatus } from '../types';

type MatchRequestRow = Tables<'match_requests'>;

export interface CreateMatchRequestData {
  senderPetId: string;
  recipientPetId: string;
  message: string;
  proposedDate?: string;
}

function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add the Supabase env vars to .env.');
  }
  return supabase;
}

function mapMatchRequestRow(row: MatchRequestRow): MatchRequest {
  return {
    id: row.id,
    senderPetId: row.sender_pet_id,
    senderOwnerId: row.sender_id,
    recipientPetId: row.pet_id,
    recipientOwnerId: row.recipient_id,
    message: row.message ?? '',
    proposedDate: row.proposed_date ?? undefined,
    status: row.status,
    relativeWarning: row.relative_warning,
    createdAt: row.created_at,
    respondedAt: row.responded_at ?? undefined,
    completedAt: row.completed_at ?? undefined,
  };
}

/** Row Level Security returns only requests where the signed-in user is sender or recipient. */
export async function fetchMatchRequests(): Promise<MatchRequest[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from('match_requests')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw error;
  return data.map(mapMatchRequestRow);
}

export async function createMatchRequest(data: CreateMatchRequestData): Promise<MatchRequest> {
  const client = requireSupabase();
  // Clients may only write these four columns. The database sets the sender, the recipient
  // and the status itself, so `recipient_id` is deliberately left out of the payload.
  const payload = {
    sender_pet_id: data.senderPetId,
    pet_id: data.recipientPetId,
    message: data.message,
    proposed_date: data.proposedDate ?? null,
  } as TablesInsert<'match_requests'>;

  const { data: row, error } = await client
    .from('match_requests')
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return mapMatchRequestRow(row);
}

/** The only way to change a request's status. The database checks who may do what. */
async function setStatus(id: string, status: MatchRequestStatus): Promise<MatchRequest> {
  const client = requireSupabase();
  const { data, error } = await client.rpc('set_match_request_status', {
    p_id: id,
    p_status: status,
  });
  if (error) throw error;
  return mapMatchRequestRow(data);
}

export function respondToMatchRequest(
  id: string,
  status: Extract<MatchRequestStatus, 'accepted' | 'declined'>
): Promise<MatchRequest> {
  return setStatus(id, status);
}

export function completeMatchRequest(id: string): Promise<MatchRequest> {
  return setStatus(id, 'completed');
}

export function cancelMatchRequest(id: string): Promise<MatchRequest> {
  return setStatus(id, 'cancelled');
}

/** Phone number of the other owner. The server refuses until the request is accepted. */
export async function fetchMatchContact(requestId: string): Promise<MatchContact | null> {
  const client = requireSupabase();
  const { data, error } = await client.rpc('get_match_contact', { p_request_id: requestId });
  if (error) throw error;
  const contact = data[0];
  return contact ? { name: contact.contact_name, phone: contact.contact_phone } : null;
}
