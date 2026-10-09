import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client/apiClient';
import { GetUserMuralsResponseData } from '@/lib/api-client/types/response';

export const userMuralsQueryKey = ['murals', 'user'];

export const useUserMurals = (enabled: boolean = true) => {
  return useQuery<GetUserMuralsResponseData>({
    queryKey: userMuralsQueryKey,
    queryFn: async () => {
      const result = await apiClient.mural.getUserMurals();

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch murals');
      }

      return result.data;
    },
    enabled,
    staleTime: 60 * 1000,
  });
};
