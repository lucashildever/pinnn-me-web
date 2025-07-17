import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client/apiClient";
import { IPin } from "../pin/types/pin";

export const usePins = (collectionId: string, initialPins?: IPin[] | null) => {
  const query = useInfiniteQuery({
    queryKey: ["pins", collectionId, "infinite"],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await apiClient.pins.getPaginated(
        collectionId,
        pageParam,
        5
      );
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch pins");
      }
      if (!result.data) {
        throw new Error("No data found in response");
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
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    placeholderData:
      initialPins && initialPins.length > 0
        ? {
            pages: [
              {
                success: true,
                data: {
                  data: initialPins,
                  pagination: {
                    currentPage: 1,
                    totalItems: initialPins.length,
                    itemsPerPage: 5,
                  },
                },
              },
            ],
            pageParams: [1],
          }
        : undefined,
  });

  const allPins = React.useMemo(() => {
    if (!query.data?.pages) {
      return [];
    }

    return query.data.pages
      .filter((page) => page.success && page.data?.data)
      .flatMap((page) => page.data.data);
  }, [query.data?.pages]);

  return {
    ...query,
    pins: allPins,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  };
};
