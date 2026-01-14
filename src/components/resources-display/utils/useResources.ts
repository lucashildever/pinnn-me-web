import React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client/apiClient';
import { Resource } from '../types/resource';
import { Pagination } from '@/lib/types/pagination';
import { GetResourcesResponseData } from '@/lib/api-client/types/response';

export type PaginatedResources = GetResourcesResponseData;

export const useResources = (
  collectionId: string,
  initialResources?: PaginatedResources,
) => {
  // Compute initial data outside the query config for stable reference
  const computedInitialData = React.useMemo(() => {
    if (!initialResources) return undefined;

    return {
      pages: [
        {
          success: true,
          data: initialResources,
        },
      ],
      pageParams: [1],
    };
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
      // Check if lastPage has data and pagination
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

    const pinnedResourcesMap = new Map<string, Resource>();
    const regularResources: Resource[] = [];

    query.data.pages.forEach((page: any) => {
      if (!page.success || !page.data) return;

      // Extract pinned resources
      if (
        page.data.pinnedResources &&
        Array.isArray(page.data.pinnedResources)
      ) {
        page.data.pinnedResources.forEach((pinned: any) => {
          if (pinned.resource) {
            const resourceWithPinFlag = { ...pinned.resource, isPinned: true };
            pinnedResourcesMap.set(pinned.resource.id, resourceWithPinFlag);
          }
        });
      }

      // Extract regular resources
      const resources = page.data.resources || page.data.data || [];
      if (Array.isArray(resources)) {
        regularResources.push(...resources);
      }
    });

    // Convert map to array (deduplicated by ID naturally via Map)
    // Note: We might want to preserve order if backend sends specific order
    // But Map iterates in insertion order, so if they come ordered, we are good.
    // If we receive the same pinned resource in multiple pages, it re-sets it, maintaining latest (or first if we check).

    // Better strategy for pinned: Use the ones from the first page (or accumulate all unique ones).
    const pinned = Array.from(pinnedResourcesMap.values());

    // Filter regular resources to remove any that are also in pinned (if backend duplicates them)
    const filteredRegular = regularResources.filter(
      (r) => !pinnedResourcesMap.has(r.id),
    );

    return [...pinned, ...filteredRegular];
  }, [query.data?.pages]);

  return {
    ...query,
    resources: allResources,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  };
};
