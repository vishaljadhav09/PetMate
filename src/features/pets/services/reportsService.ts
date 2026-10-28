import { supabase } from '@/integrations/supabase';
import type { ReportReason } from '../types';

export interface CreateReportData {
  petId: string;
  reason: ReportReason;
  details?: string;
}

/**
 * Reports are private to the reporter and admins, so nothing is read back. After three
 * different reporters the database hides the pet automatically.
 */
export async function createReport(data: CreateReportData): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add the Supabase env vars to .env.');
  }
  const { error } = await supabase.from('reports').insert({
    reported_pet_id: data.petId,
    reason: data.reason,
    details: data.details ?? null,
  });
  if (error) throw error;
}
