import { z } from 'zod/v4';

/** E.164, e.g. +919876543210. Matches the `profile_private.phone` check constraint. */
const PHONE_PATTERN = /^\+[1-9][0-9]{7,14}$/;

export const profileSchema = z.object({
  name: z.string().trim().min(1, 'validation.required').max(60, 'validation.profileNameMax'),
  city: z.string().trim().max(80, 'validation.profileCityMax'),
  phone: z
    .string()
    .trim()
    .refine((value) => value === '' || PHONE_PATTERN.test(value), {
      message: 'validation.phoneInvalid',
    }),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
