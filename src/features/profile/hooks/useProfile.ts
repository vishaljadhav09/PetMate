import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/providers/auth/authStore';
import { fetchMyProfile, updateMyProfile } from '../services/profileService';
import type { UpdateProfileData } from '../types';

export const PROFILE_KEYS = {
  me: (userId: string) => ['profile', userId] as const,
};

export function useMyProfile() {
  const userId = useAuthStore((s) => s.user?.id);
  return useQuery({
    queryKey: PROFILE_KEYS.me(userId ?? ''),
    queryFn: () => fetchMyProfile(userId as string),
    enabled: !!userId,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id);
  return useMutation({
    mutationFn: (data: UpdateProfileData) => updateMyProfile(userId as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.me(userId ?? '') });
    },
  });
}
