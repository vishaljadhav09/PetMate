import { z } from 'zod/v4';

export const reportSchema = z.object({
  reason: z.enum(['underage_pet', 'no_health_docs', 'spam', 'scam', 'abuse_concern']),
  details: z.string().trim().max(500, 'validation.detailsMax').optional(),
});

export type ReportFormData = z.infer<typeof reportSchema>;
