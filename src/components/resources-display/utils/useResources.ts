import React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client/apiClient';
import { Resource } from '../types/resource';
import { Pagination } from '@/lib/types/pagination';

export interface PaginatedResources {
  resources: Resource[];
  pagination: Pagination;
}

export const useResources = (collectionId: string, initialResources?: any) => {
  const query = useInfiniteQuery({
    queryKey: ['resources', collectionId, 'infinite'],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await apiClient.resources.getResources(
        collectionId,
        pageParam,
        5,
      );
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch resources');
      }
      if (!result.data) {
        throw new Error('No data found in response');
      }
      return result;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.success || !lastPage.data?.pagination) {
        return undefined;
      }

      const { currentPage, totalItems, itemsPerPage } =
        lastPage.data.pagination;
      const totalPages = Math.ceil(totalItems / itemsPerPage);

      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    enabled: !!collectionId,
    staleTime:
      initialResources && initialResources.resources.length > 0 ? Infinity : 0,
    gcTime: 5 * 60 * 1000,
    initialData: () => {
      if (initialResources && initialResources.resources.length > 0) {
        return {
          pages: [
            {
              success: true,
              data: {
                data: initialResources.resources,
                pagination: initialResources.pagination,
              },
            },
          ],
          pageParams: [1],
        };
      }
      return undefined;
    },
  });

  const allResources = React.useMemo(() => {
    if (!query.data?.pages) {
      return [];
    }

    return query.data.pages
      .filter((page) => page.success && page.data?.data)
      .flatMap((page) => page.data.data);
  }, [query.data?.pages]);

  return {
    ...query,
    resources: allResources,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  };
};
