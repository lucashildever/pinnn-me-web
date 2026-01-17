import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client/apiClient';
import { CollectionTab } from '../types/collectionTab';
import { FetcherSuccess } from '@/lib/api-client/types/response';

export function useCollections(muralId: string) {
  return useQuery({
    queryKey: ['collections', muralId],
    queryFn: async () => {
      const response = await apiClient.collection.getAll(muralId);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch collections');
      }
      // Type assertion is safe here because we checked success above
      return (response as FetcherSuccess<CollectionTab[]>).data;
    },
    enabled: !!muralId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
