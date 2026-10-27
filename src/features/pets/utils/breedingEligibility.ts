import type { Pet, PetSpecies } from '../types/pet.types';

/** Minimum age, in months, before a pet of each species is eligible for match requests. */
export const BREEDING_MIN_AGE_MONTHS: Record<PetSpecies, number> = {
  dog: 12,
  cat: 10,
  rabbit: 6,
  bird: 12,
  horse: 36,
  other: 12,
};

export function ageInMonths(dateOfBirth: string, now: Date = new Date()): number {
  const dob = new Date(dateOfBirth);
  return (now.getFullYear() - dob.getFullYear()) * 12 + (now.getMonth() - dob.getMonth());
}

/**
 * Whether a pet has reached the minimum breeding age for its species. Computed
 * from `dateOfBirth` at read time (rather than stored) so it stays correct as
 * the pet ages, instead of only being accurate at creation time.
 */
export function isBreedingEligible(pet: Pick<Pet, 'species' | 'dateOfBirth'>, now?: Date): boolean {
  return ageInMonths(pet.dateOfBirth, now) >= BREEDING_MIN_AGE_MONTHS[pet.species];
}

export function ageLabel(dateOfBirth: string, now?: Date): { years: number; months: number } {
  const totalMonths = Math.max(0, ageInMonths(dateOfBirth, now));
  return { years: Math.floor(totalMonths / 12), months: totalMonths % 12 };
}
