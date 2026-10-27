import { z } from 'zod/v4';

export const ratingSchema = z.object({
  stars: z.number().min(1, 'validation.ratingRequired').max(5),
  comment: z.string().trim().max(300, 'validation.commentMax').optional(),
});

export type RatingFormData = z.infer<typeof ratingSchema>;
