import { z } from 'zod/v4';

export const matchRequestSchema = z.object({
  senderPetId: z.string().min(1, 'validation.required'),
  message: z.string().trim().min(1, 'validation.required').max(300, 'validation.messageMax'),
  proposedDate: z
    .string()
    .optional()
    .refine((value) => !value || !Number.isNaN(new Date(value).getTime()), {
      message: 'validation.dateInvalid',
    }),
});

export type MatchRequestFormData = z.infer<typeof matchRequestSchema>;
