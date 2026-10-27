import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MOCK_CURRENT_USER_ID } from '../services/mockDb';
import {
  createPet,
  fetchCurrentUser,
  fetchPetById,
  fetchPetOwner,
  fetchPets,
  updatePet,
} from '../services/petsService';
import type { CreatePetData, Pet, PetFilters, UpdatePetData } from '../types';

export const PETS_KEYS = {
  all: ['pets'] as const,
  list: (filters?: PetFilters) => [...PETS_KEYS.all, 'list', filters ?? {}] as const,
  detail: (id: string) => [...PETS_KEYS.all, 'detail', id] as const,
  owners: ['petOwners'] as const,
  owner: (id: string) => [...PETS_KEYS.owners, id] as const,
  currentUser: ['petOwners', 'me'] as const,
};

export function usePets(filters?: PetFilters) {
  return useQuery({ queryKey: PETS_KEYS.list(filters), queryFn: () => fetchPets(filters) });
}

export function usePet(id: string) {
  return useQuery({
    queryKey: PETS_KEYS.detail(id),
    queryFn: () => fetchPetById(id),
    enabled: !!id,
  });
}

/** Client-side view over `usePets()`'s own cache, filtered to the current user's pets. */
export function useMyPets() {
  const query = usePets();
  return {
    ...query,
    data: query.data?.filter((pet) => pet.ownerId === MOCK_CURRENT_USER_ID),
  };
}

export function usePetOwner(ownerId: string) {
  return useQuery({
    queryKey: PETS_KEYS.owner(ownerId),
    queryFn: () => fetchPetOwner(ownerId),
    enabled: !!ownerId,
  });
}

export function useCurrentUser() {
  return useQuery({ queryKey: PETS_KEYS.currentUser, queryFn: fetchCurrentUser });
}

export function useCreatePet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePetData) => createPet(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PETS_KEYS.all });
    },
  });
}

export function useUpdatePet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePetData }) => updatePet(id, data),
    onSuccess: (updated: Pet) => {
      queryClient.invalidateQueries({ queryKey: PETS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PETS_KEYS.detail(updated.id) });
    },
  });
}
