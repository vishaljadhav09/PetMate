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

export type CreatePetData = Omit<Pet, 'id' | 'ownerId' | 'createdAt' | 'distanceKm'>;
export type UpdatePetData = Partial<CreatePetData>;

export interface PetFilters {
  ownerId?: string;
  excludeOwnerId?: string;
  species?: PetSpecies;
  gender?: PetGender;
  breedQuery?: string;
  verifiedOnly?: boolean;
}
