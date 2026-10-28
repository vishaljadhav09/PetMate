import type { PetSpecies } from '../types/pet.types';

/**
 * Preset breeds offered in the breed dropdown, per species. Breed names are proper nouns and are
 * stored as-is (not translated). Owners can type any breed that is missing from a list.
 */
export const BREEDS: Record<PetSpecies, string[]> = {
  dog: [
    'Beagle',
    'Boxer',
    'Bulldog',
    'Chihuahua',
    'Cocker Spaniel',
    'Dachshund',
    'Dalmatian',
    'Doberman',
    'French Bulldog',
    'German Shepherd',
    'Golden Retriever',
    'Great Dane',
    'Indian Pariah (Desi)',
    'Indian Spitz',
    'Labrador Retriever',
    'Lhasa Apso',
    'Mudhol Hound',
    'Pomeranian',
    'Pug',
    'Rajapalayam',
    'Rottweiler',
    'Saint Bernard',
    'Shih Tzu',
    'Siberian Husky',
  ],
  cat: [
    'Abyssinian',
    'Bengal',
    'British Shorthair',
    'Himalayan',
    'Indian Domestic (Desi)',
    'Maine Coon',
    'Persian',
    'Ragdoll',
    'Siamese',
    'Sphynx',
  ],
  bird: [
    'African Grey',
    'Budgerigar',
    'Canary',
    'Cockatiel',
    'Finch',
    'Indian Ringneck',
    'Lovebird',
    'Macaw',
  ],
  rabbit: [
    'Flemish Giant',
    'Holland Lop',
    'Lionhead',
    'Mini Rex',
    'Netherland Dwarf',
    'New Zealand White',
  ],
  horse: ['Arabian', 'Kathiawari', 'Manipuri Pony', 'Marwari', 'Spiti', 'Thoroughbred', 'Zanskari'],
  other: [],
};

/** The preset breed that matches `breed` ignoring case and spacing, if any. */
export function findPresetBreed(species: PetSpecies, breed: string): string | undefined {
  const wanted = breed.trim().toLowerCase();
  return BREEDS[species].find((preset) => preset.toLowerCase() === wanted);
}
