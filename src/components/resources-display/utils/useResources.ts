import React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client/apiClient';
import { Resource } from '../types/resource';
import { Pagination } from '@/lib/types/pagination';

export interface PaginatedResources {
  resources: Resource[];
  pagination: Pagination;
}

export const useResources = (
  collectionId: string,
  initialResources?: PaginatedResources,
) => {
  // Compute initial data outside the query config for stable reference
  // Handle both possible API structures: { resources: [...] } or { data: [...] }
  const computedInitialData = React.useMemo(() => {
    if (!initialResources) return undefined;

    // Support both { resources: [...] } and { data: [...] } structures
    const resourcesArray =
      (initialResources as any).resources || (initialResources as any).data;
    const pagination = initialResources.pagination;

    if (resourcesArray && resourcesArray.length > 0) {
      return {
        pages: [
          {
            success: true,
            data: {
              data: resourcesArray,
              pagination: pagination,
            },
          },
        ],
        pageParams: [1],
      };
    }
    return undefined;
  }, [initialResources]);

  const hasInitialData = !!computedInitialData;

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
    initialPageParam: hasInitialData ? 2 : 1, // Start from page 2 if we have initial data
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
    staleTime: hasInitialData ? Infinity : 0,
    gcTime: 5 * 60 * 1000,
    initialData: computedInitialData,
  });

  const allResources = React.useMemo(() => {
    if (!query.data?.pages) {
      return [];
    }

    return query.data.pages
      .filter((page: any) => {
        const hasData =
          page.success && (page.data?.data || page.data?.resources);
        return hasData;
      })
      .flatMap((page: any) => {
        const resources = page.data.data || page.data.resources || [];
        return resources as Resource[];
      });
  }, [query.data?.pages]);

  return {
    ...query,
    resources: allResources,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  };
};
