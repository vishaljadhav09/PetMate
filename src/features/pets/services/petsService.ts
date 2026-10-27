import type { CreatePetData, Pet, PetFilters, PetOwner, UpdatePetData } from '../types';
import { delay, generateId, mockPets, mockUsers, MOCK_CURRENT_USER_ID } from './mockDb';

export async function fetchPets(filters: PetFilters = {}): Promise<Pet[]> {
  const results = mockPets.filter((pet) => {
    if (filters.ownerId && pet.ownerId !== filters.ownerId) return false;
    if (filters.excludeOwnerId && pet.ownerId === filters.excludeOwnerId) return false;
    if (filters.species && pet.species !== filters.species) return false;
    if (filters.gender && pet.gender !== filters.gender) return false;
    if (
      filters.breedQuery &&
      !pet.breed.toLowerCase().includes(filters.breedQuery.trim().toLowerCase())
    ) {
      return false;
    }
    if (filters.verifiedOnly) {
      const owner = mockUsers.find((user) => user.id === pet.ownerId);
      if (!owner?.verifiedOwner) return false;
    }
    return true;
  });
  return delay([...results]);
}

export async function fetchPetById(id: string): Promise<Pet> {
  const pet = mockPets.find((item) => item.id === id);
  if (!pet) throw new Error('Pet not found');
  return delay(pet);
}

export async function createPet(data: CreatePetData): Promise<Pet> {
  const pet: Pet = {
    ...data,
    id: generateId('pet'),
    ownerId: MOCK_CURRENT_USER_ID,
    createdAt: new Date().toISOString().slice(0, 10),
  };
  mockPets.unshift(pet);
  return delay(pet);
}

export async function updatePet(id: string, data: UpdatePetData): Promise<Pet> {
  const index = mockPets.findIndex((pet) => pet.id === id);
  if (index === -1) throw new Error('Pet not found');
  const updated: Pet = { ...mockPets[index], ...data };
  mockPets[index] = updated;
  return delay(updated);
}

export async function fetchPetOwner(ownerId: string): Promise<PetOwner> {
  const owner = mockUsers.find((user) => user.id === ownerId);
  if (!owner) throw new Error('Pet owner not found');
  return delay(owner);
}

export async function fetchCurrentUser(): Promise<PetOwner> {
  return fetchPetOwner(MOCK_CURRENT_USER_ID);
}
