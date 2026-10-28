export type MatchRequestStatus = 'new' | 'accepted' | 'declined' | 'completed' | 'cancelled';

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
  /** True when both pets share a litter reference (a possible close relation). Advisory only. */
  relativeWarning: boolean;
  /** ISO timestamp. */
  createdAt: string;
  respondedAt?: string;
  completedAt?: string;
}

/** The other owner's contact details, only available once a request is accepted. */
export interface MatchContact {
  name: string;
  phone: string;
}
