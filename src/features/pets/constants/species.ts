import type { PetSpecies } from '../types/pet.types';

/** Emoji shown as the "photo" of a pet until real images are supported. */
export const SPECIES_EMOJI: Record<PetSpecies, string> = {
  dog: '🐕',
  cat: '🐈',
  bird: '🦜',
  rabbit: '🐇',
  horse: '🐎',
  other: '🐾',
};
