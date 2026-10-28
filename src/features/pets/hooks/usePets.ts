import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/providers/auth/authStore';
import {
  createPet,
  fetchNearbyPets,
  fetchPetAddress,
  fetchPetById,
  fetchPetOwner,
  fetchPets,
  NEARBY_PAGE_SIZE,
  savePetAddress,
  updatePet,
} from '../services/petsService';
import type { NearbyArgs } from '../services/petsService';
import type { CreatePetData, Pet, PetAddress, PetFilters, UpdatePetData } from '../types';

export const PETS_KEYS = {
  all: ['pets'] as const,
  list: (filters?: PetFilters) => [...PETS_KEYS.all, 'list', filters ?? {}] as const,
  detail: (id: string) => [...PETS_KEYS.all, 'detail', id] as const,
  address: (id: string) => [...PETS_KEYS.all, 'address', id] as const,
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

export function usePetAddress(id: string) {
  return useQuery({
    queryKey: PETS_KEYS.address(id),
    queryFn: () => fetchPetAddress(id),
    enabled: !!id,
  });
}

export function useSavePetAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ petId, address }: { petId: string; address: PetAddress }) =>
      savePetAddress(petId, address),
    onSuccess: (_data, { petId }) => {
      queryClient.invalidateQueries({ queryKey: PETS_KEYS.address(petId) });
    },
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

export function useNearbyPets(args: Omit<NearbyArgs, 'page'> | undefined) {
  return useInfiniteQuery({
    queryKey: [...PETS_KEYS.all, 'nearby', args] as const,
    queryFn: ({ pageParam }) => fetchNearbyPets({ ...(args as NearbyArgs), page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _pages, lastPageParam) =>
      lastPage.length === NEARBY_PAGE_SIZE ? lastPageParam + 1 : undefined,
    enabled: !!args,
  });
}
