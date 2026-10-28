import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createRating,
  fetchRatingsForMatchRequest,
  fetchRatingsForUser,
} from '../services/ratingsService';
import type { CreateRatingData } from '../services/ratingsService';

export const RATINGS_KEYS = {
  all: ['ratings'] as const,
  forUser: (userId: string) => [...RATINGS_KEYS.all, 'user', userId] as const,
  forRequest: (matchRequestId: string) => [...RATINGS_KEYS.all, 'request', matchRequestId] as const,
};

export function useRatingsForUser(userId: string) {
  return useQuery({
    queryKey: RATINGS_KEYS.forUser(userId),
    queryFn: () => fetchRatingsForUser(userId),
    enabled: !!userId,
  });
}

/** Used to gate "Rate owner" (not yet rated) vs. "Rated" for a completed match request. */
export function useRatingsForMatchRequest(matchRequestId: string) {
  return useQuery({
    queryKey: RATINGS_KEYS.forRequest(matchRequestId),
    queryFn: () => fetchRatingsForMatchRequest(matchRequestId),
    enabled: !!matchRequestId,
  });
}

export function useCreateRating() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRatingData) => createRating(data),
    onSuccess: (rating) => {
      queryClient.invalidateQueries({ queryKey: ['petOwners'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: RATINGS_KEYS.forUser(rating.ratedUserId) });
      queryClient.invalidateQueries({ queryKey: RATINGS_KEYS.forRequest(rating.matchRequestId) });
    },
  });
}
