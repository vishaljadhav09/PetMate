export type ReportReason = 'underage_pet' | 'no_health_docs' | 'spam' | 'scam' | 'abuse_concern';

export interface Report {
  id: string;
  petId: string;
  reporterUserId: string;
  reason: ReportReason;
  details?: string;
  createdAt: string;
}
