import type { MatchRequest, Pet, PetOwner, Rating, Report } from '../types';

/**
 * TEMPORARY mock "database" — module-level mutable state, resets on every
 * reload. There is no real backend yet. Delete this file (and swap the
 * `*Service.ts` function bodies for real `api` calls) once one exists — the
 * hooks and components that consume those services do not need to change.
 */

export const MOCK_CURRENT_USER_ID = 'user-1';

function monthsAgo(months: number): string {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date.toISOString().slice(0, 10);
}

export const mockUsers: PetOwner[] = [
  {
    id: 'user-1',
    name: 'Alex Morgan',
    phone: '+1 555-0101',
    city: 'Springfield',
    verifiedOwner: true,
  },
  {
    id: 'user-2',
    name: 'Jordan Lee',
    phone: '+1 555-0202',
    city: 'Riverside',
    verifiedOwner: false,
  },
];

export const mockPets: Pet[] = [
  {
    id: 'pet-1',
    ownerId: 'user-1',
    name: 'Simba',
    species: 'dog',
    breed: 'Labrador Retriever',
    gender: 'male',
    dateOfBirth: monthsAgo(22),
    vaccinationUpToDate: true,
    pedigreeCertified: true,
    registrationNumber: 'KCI118823',
    description: 'Friendly, health tested, great with other dogs.',
    studTerms: { type: 'fixedFee', feeAmount: 6000 },
    city: 'Springfield',
    availableForMatching: true,
    createdAt: monthsAgo(22),
  },
  {
    id: 'pet-2',
    ownerId: 'user-1',
    name: 'Milo',
    species: 'cat',
    breed: 'Persian',
    gender: 'male',
    dateOfBirth: monthsAgo(20),
    vaccinationUpToDate: true,
    pedigreeCertified: false,
    description: 'Calm, indoor cat, first-time stud.',
    studTerms: { type: 'negotiable' },
    city: 'Springfield',
    availableForMatching: true,
    createdAt: monthsAgo(20),
  },
  {
    id: 'pet-3',
    ownerId: 'user-2',
    name: 'Luna',
    species: 'dog',
    breed: 'Labrador Retriever',
    gender: 'female',
    dateOfBirth: monthsAgo(19),
    vaccinationUpToDate: true,
    pedigreeCertified: false,
    description: 'Calm temperament, first litter, vet checked last month.',
    studTerms: { type: 'negotiable' },
    city: 'Riverside',
    availableForMatching: true,
    distanceKm: 4.1,
    createdAt: monthsAgo(19),
  },
  {
    id: 'pet-4',
    ownerId: 'user-2',
    name: 'Bella',
    species: 'dog',
    breed: 'Labrador Retriever',
    gender: 'female',
    dateOfBirth: monthsAgo(27),
    vaccinationUpToDate: true,
    pedigreeCertified: true,
    registrationNumber: 'KCI109456',
    description: 'Show-line Labrador, hip score normal, two prior successful litters.',
    studTerms: { type: 'pickOfLitter' },
    city: 'Riverside',
    availableForMatching: true,
    distanceKm: 6.2,
    createdAt: monthsAgo(27),
  },
  {
    id: 'pet-5',
    ownerId: 'user-2',
    name: 'Rocky',
    species: 'dog',
    breed: 'Rottweiler',
    gender: 'male',
    dateOfBirth: monthsAgo(30),
    vaccinationUpToDate: true,
    pedigreeCertified: true,
    registrationNumber: 'KCI220981',
    description: 'Well-tempered, hip and elbow tested.',
    studTerms: { type: 'fixedFee', feeAmount: 9000 },
    city: 'Riverside',
    availableForMatching: true,
    distanceKm: 6.2,
    createdAt: monthsAgo(30),
  },
  {
    id: 'pet-6',
    ownerId: 'user-2',
    name: 'Coco',
    species: 'cat',
    breed: 'Persian',
    gender: 'female',
    dateOfBirth: monthsAgo(3),
    vaccinationUpToDate: false,
    pedigreeCertified: false,
    description: 'Adorable Persian kitten, still growing.',
    studTerms: { type: 'free' },
    city: 'Riverside',
    availableForMatching: false,
    distanceKm: 6.2,
    createdAt: monthsAgo(3),
  },
];

export const mockMatchRequests: MatchRequest[] = [];
export const mockRatings: Rating[] = [];
export const mockReports: Report[] = [];

let idSequence = 100;
export function generateId(prefix: string): string {
  idSequence += 1;
  return `${prefix}-${idSequence}`;
}

const MOCK_LATENCY_MS = 300;

/** Wraps a value in a resolved promise after a short delay, to mimic real network latency. */
export function delay<T>(value: T, ms: number = MOCK_LATENCY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
