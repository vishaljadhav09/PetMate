export type MatchRequestStatus = 'new' | 'accepted' | 'declined' | 'completed';

export interface MatchRequest {
  id: string;
  senderPetId: string;
  senderOwnerId: string;
  recipientPetId: string;
  recipientOwnerId: string;
  message: string;
  /** ISO date string. */
  proposedDate?: string;
  status: MatchRequestStatus;
  createdAt: string;
  respondedAt?: string;
  completedAt?: string;
}
