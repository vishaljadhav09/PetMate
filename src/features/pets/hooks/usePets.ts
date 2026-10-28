import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/providers/auth/authStore';
import {
  createPet,
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

export function useMyPets() {
  const userId = useAuthStore((s) => s.user?.id);
  return useQuery({
    queryKey: PETS_KEYS.list({ ownerId: userId }),
    queryFn: () => fetchPets({ ownerId: userId }),
    enabled: !!userId,
  });
}

export function usePetOwner(ownerId: string) {
  return useQuery({
    queryKey: PETS_KEYS.owner(ownerId),
    queryFn: () => fetchPetOwner(ownerId),
    enabled: !!ownerId,
  });
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
