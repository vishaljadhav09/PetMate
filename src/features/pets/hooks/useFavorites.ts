import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/providers/auth/authStore';
import { addFavorite, fetchFavoritePetIds, removeFavorite } from '../services/favoritesService';

export const FAVORITES_KEYS = {
  all: ['favorites'] as const,
};

export function useFavoritePetIds() {
  const userId = useAuthStore((s) => s.user?.id);
  return useQuery({
    queryKey: FAVORITES_KEYS.all,
    queryFn: fetchFavoritePetIds,
    enabled: !!userId,
  });
}

/** Adds or removes a favorite, updating the cached list immediately. */
export function useToggleFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ petId, isFavorite }: { petId: string; isFavorite: boolean }) =>
      isFavorite ? removeFavorite(petId) : addFavorite(petId),
    onMutate: async ({ petId, isFavorite }) => {
      await queryClient.cancelQueries({ queryKey: FAVORITES_KEYS.all });
      const previous = queryClient.getQueryData<string[]>(FAVORITES_KEYS.all);
      queryClient.setQueryData<string[]>(FAVORITES_KEYS.all, (old = []) =>
        isFavorite ? old.filter((id) => id !== petId) : [petId, ...old]
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(FAVORITES_KEYS.all, context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: FAVORITES_KEYS.all });
    },
  });
}
