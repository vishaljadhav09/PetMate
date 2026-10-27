import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  completeMatchRequest,
  createMatchRequest,
  fetchMatchRequests,
  respondToMatchRequest,
} from '../services/matchRequestsService';
import type { CreateMatchRequestData } from '../services/matchRequestsService';
import type { MatchRequest, MatchRequestStatus } from '../types';

export const MATCH_REQUESTS_KEYS = {
  all: ['matchRequests'] as const,
  list: () => [...MATCH_REQUESTS_KEYS.all, 'list'] as const,
};

export function useMatchRequests() {
  return useQuery({ queryKey: MATCH_REQUESTS_KEYS.list(), queryFn: fetchMatchRequests });
}

export function useCreateMatchRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMatchRequestData) => createMatchRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MATCH_REQUESTS_KEYS.all });
    },
  });
}

export function useRespondToMatchRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: Extract<MatchRequestStatus, 'accepted' | 'declined'>;
    }) => respondToMatchRequest(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: MATCH_REQUESTS_KEYS.list() });
      const previous = queryClient.getQueryData<MatchRequest[]>(MATCH_REQUESTS_KEYS.list());
      queryClient.setQueryData<MatchRequest[]>(MATCH_REQUESTS_KEYS.list(), (old) =>
        old?.map((request) => (request.id === id ? { ...request, status } : request))
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(MATCH_REQUESTS_KEYS.list(), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: MATCH_REQUESTS_KEYS.all });
    },
  });
}

export function useCompleteMatchRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => completeMatchRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MATCH_REQUESTS_KEYS.all });
    },
  });
}
