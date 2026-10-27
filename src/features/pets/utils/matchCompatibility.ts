import type { Pet } from '../types/pet.types';
import { isBreedingEligible } from './breedingEligibility';

export type MatchIncompatibilityReason =
  | 'speciesMismatch'
  | 'genderMismatch'
  | 'senderIneligible'
  | 'recipientIneligible'
  | 'senderUnavailable'
  | 'recipientUnavailable'
  | 'sameOwner';

/**
 * Returns why `sender` cannot send a match request to `recipient`, or `null`
 * if the pair is compatible. Client-side only — a real backend must
 * re-validate these rules server-side before persisting a match request.
 */
export function getMatchIncompatibilityReason(
  sender: Pet,
  recipient: Pet
): MatchIncompatibilityReason | null {
  if (sender.ownerId === recipient.ownerId) return 'sameOwner';
  if (sender.species !== recipient.species) return 'speciesMismatch';
  if (sender.gender === recipient.gender) return 'genderMismatch';
  if (!sender.availableForMatching) return 'senderUnavailable';
  if (!recipient.availableForMatching) return 'recipientUnavailable';
  if (!isBreedingEligible(sender)) return 'senderIneligible';
  if (!isBreedingEligible(recipient)) return 'recipientIneligible';
  return null;
}

export function isCompatibleMatch(sender: Pet, recipient: Pet): boolean {
  return getMatchIncompatibilityReason(sender, recipient) === null;
}
