export type PetSpecies = 'dog' | 'cat' | 'bird' | 'rabbit' | 'horse' | 'other';

export type PetGender = 'male' | 'female';

export type StudTermsType = 'fixedFee' | 'negotiable' | 'pickOfLitter' | 'free';

export interface StudTerms {
  type: StudTermsType;
  /** Only meaningful when `type === 'fixedFee'`. */
  feeAmount?: number;
}

export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  species: PetSpecies;
  breed: string;
  gender: PetGender;
  /** ISO date string, e.g. '2023-05-14'. */
  dateOfBirth: string;
  vaccinationUpToDate: boolean;
  pedigreeCertified: boolean;
  /** Only meaningful when `pedigreeCertified` is true. */
  registrationNumber?: string;
  description: string;
  studTerms: StudTerms;
  city: string;
  /** Up to 4 image URLs (Cloudinary). */
  photos: string[];
  /** ISO date of the last vet checkup. */
  lastVetCheckup?: string;
  hipScore?: string;
  /** Path of the private health/pedigree document in the `pet-certificates` bucket. */
  certificatePath?: string;
  /** Optional shared litter/parent reference, used only for the close-relative advisory. */
  litterRef?: string;
  /** Owner confirms the pet is healthy and ready for breeding. Required to be available. */
  ownerAttestsBreedingReady: boolean;
  /** Approximate (about 500 m grid) coordinates, set by the server. Read-only. */
  lat?: number;
  lng?: number;
  /** Set by an admin after reviewing the certificate. Read-only. */
  verified: boolean;
  /** False while the listing waits for admin approval. Read-only. */
  approved: boolean;
  /** True when an admin or the report auto-hide removed the listing. Read-only. */
  hidden: boolean;
  /**
   * Owner-controlled toggle for whether this pet is currently open to match
   * requests, independent of the derived age-eligibility check — see
   * `isBreedingEligible` in `utils/breedingEligibility.ts`.
   */
  availableForMatching: boolean;
  /** Distance from the current user, in kilometers. Only set for nearby/discovery results. */
  distanceKm?: number;
  createdAt: string;
}

export type CreatePetData = Omit<
  Pet,
  'id' | 'ownerId' | 'createdAt' | 'distanceKm' | 'verified' | 'approved' | 'hidden' | 'lat' | 'lng'
> & {
  /** Where the pet lives. The server snaps it to a ~500 m grid before storing. */
  location: { lat: number; lng: number };
};
export type UpdatePetData = Partial<CreatePetData>;

export interface PetFilters {
  /** Restrict to these pet ids, e.g. the user's favorites. */
  ids?: string[];
  ownerId?: string;
  excludeOwnerId?: string;
  species?: PetSpecies;
  gender?: PetGender;
  breedQuery?: string;
  verifiedOnly?: boolean;
}
