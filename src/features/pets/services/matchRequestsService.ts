import type { MatchRequest, MatchRequestStatus } from '../types';
import { delay, generateId, mockMatchRequests } from './mockDb';
import { fetchPetById } from './petsService';

export interface CreateMatchRequestData {
  senderPetId: string;
  recipientPetId: string;
  message: string;
  proposedDate?: string;
}

export async function fetchMatchRequests(): Promise<MatchRequest[]> {
  return delay([...mockMatchRequests]);
}

export async function createMatchRequest(data: CreateMatchRequestData): Promise<MatchRequest> {
  const [senderPet, recipientPet] = await Promise.all([
    fetchPetById(data.senderPetId),
    fetchPetById(data.recipientPetId),
  ]);
  const request: MatchRequest = {
    id: generateId('req'),
    senderPetId: senderPet.id,
    senderOwnerId: senderPet.ownerId,
    recipientPetId: recipientPet.id,
    recipientOwnerId: recipientPet.ownerId,
    message: data.message,
    proposedDate: data.proposedDate,
    status: 'new',
    createdAt: new Date().toISOString().slice(0, 10),
  };
  mockMatchRequests.unshift(request);
  return delay(request);
}

export async function respondToMatchRequest(
  id: string,
  status: Extract<MatchRequestStatus, 'accepted' | 'declined'>
): Promise<MatchRequest> {
  const index = mockMatchRequests.findIndex((request) => request.id === id);
  if (index === -1) throw new Error('Match request not found');
  const updated: MatchRequest = {
    ...mockMatchRequests[index],
    status,
    respondedAt: new Date().toISOString().slice(0, 10),
  };
  mockMatchRequests[index] = updated;
  return delay(updated);
}

export async function completeMatchRequest(id: string): Promise<MatchRequest> {
  const index = mockMatchRequests.findIndex((request) => request.id === id);
  if (index === -1) throw new Error('Match request not found');
  const updated: MatchRequest = {
    ...mockMatchRequests[index],
    status: 'completed',
    completedAt: new Date().toISOString().slice(0, 10),
  };
  mockMatchRequests[index] = updated;
  return delay(updated);
}
