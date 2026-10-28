import { z } from 'zod/v4';

/**
 * `studFeeAmount` stays a plain optional string (what an `Input` actually
 * produces) rather than `z.coerce.number()` — coercing an empty string with
 * `z.coerce.number()` yields `0`, not `undefined`, which would defeat the
 * "required when studTermsType is 'fixedFee'" check below. It's parsed to a
 * number explicitly wherever it's consumed (`PetForm`'s submit handler).
 */
export const petSchema = z
  .object({
    name: z.string().trim().min(1, 'validation.required').max(40, 'validation.nameTooLong'),
    species: z.enum(['dog', 'cat', 'bird', 'rabbit', 'horse', 'other']),
    breed: z.string().trim().min(1, 'validation.required').max(60, 'validation.breedTooLong'),
    gender: z.enum(['male', 'female']),
    dateOfBirth: z.iso
      .date('validation.dateInvalid')
      .refine((value) => new Date(value) <= new Date(), { message: 'validation.dobFuture' }),
    vaccinationUpToDate: z.boolean(),
    pedigreeCertified: z.boolean(),
    registrationNumber: z
      .string()
      .trim()
      .max(40, 'validation.registrationNumberTooLong')
      .optional(),
    description: z.string().trim().max(500, 'validation.descriptionMax').optional(),
    studTermsType: z.enum(['fixedFee', 'negotiable', 'pickOfLitter', 'free']),
    studFeeAmount: z.string().optional(),
    city: z.string().trim().min(1, 'validation.required').max(60, 'validation.cityTooLong'),
    photos: z.array(z.string()).max(4, 'validation.photosMax'),
    lastVetCheckup: z.union([z.literal(''), z.iso.date('validation.dateInvalid')]).optional(),
    hipScore: z.string().trim().max(40, 'validation.hipScoreTooLong').optional(),
    litterRef: z.string().trim().max(60, 'validation.litterRefTooLong').optional(),
    ownerAttestsBreedingReady: z.boolean(),
    availableForMatching: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.studTermsType === 'fixedFee') {
      const amount = Number(data.studFeeAmount);
      if (!data.studFeeAmount || Number.isNaN(amount)) {
        ctx.addIssue({
          code: 'custom',
          path: ['studFeeAmount'],
          message: 'validation.studFeeRequired',
        });
      } else if (amount < 0) {
        ctx.addIssue({ code: 'custom', path: ['studFeeAmount'], message: 'validation.studFeeMin' });
      }
    }
    if (data.availableForMatching && !data.ownerAttestsBreedingReady) {
      ctx.addIssue({
        code: 'custom',
        path: ['ownerAttestsBreedingReady'],
        message: 'validation.attestRequired',
      });
    }
    if (data.pedigreeCertified && !data.registrationNumber?.trim()) {
      ctx.addIssue({
        code: 'custom',
        path: ['registrationNumber'],
        message: 'validation.registrationNumberRequired',
      });
    }
  });

export type PetFormData = z.infer<typeof petSchema>;
