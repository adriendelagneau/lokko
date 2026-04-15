"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getIsBookmarked, toggleBookmark } from "@/actions/listing-actions";

interface Listing {
  id: string;
  _count?: {
    bookmarks: number;
  };
  [key: string]: unknown;
}

interface ListingsPage {
  listings: Listing[];
}

interface ListingsResponse {
  pages: ListingsPage[];
}

export function useBookmark(listingId: string) {
  const queryClient = useQueryClient();

  const { data: isBookmarked = false } = useQuery({
    queryKey: ["bookmark", listingId],
    queryFn: () => getIsBookmarked(listingId),
    staleTime: 1000 * 60 * 5,
    enabled: !!listingId,
  });

  const mutation = useMutation({
    mutationFn: () => toggleBookmark(listingId),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["bookmark", listingId] });
      await queryClient.cancelQueries({ queryKey: ["listing", listingId] });

      const prevBookmarked =
        queryClient.getQueryData<boolean>(["bookmark", listingId]) ?? false;

      queryClient.setQueryData(["bookmark", listingId], !prevBookmarked);

      return { prevBookmarked };
    },

    onSuccess: ({ bookmarked }) => {
      // Update individual listing query
      queryClient.setQueryData(
        ["listing", listingId],
        (old: Listing | undefined) => {
          if (!old) return old;
          const currentCount = old._count?.bookmarks ?? 0;
          return {
            ...old,
            _count: {
              ...old._count,
              bookmarks: Math.max(0, currentCount + (bookmarked ? 1 : -1)),
            },
          };
        }
      );

      // Update listings list query
      queryClient.setQueriesData(
        { queryKey: ["listings"] },
        (old: ListingsResponse | undefined) => {
          if (!old?.pages) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              listings: page.listings.map((l) => {
                if (l?.id !== listingId) return l;
                const currentCount = l._count?.bookmarks ?? 0;
                return {
                  ...l,
                  _count: {
                    ...l._count,
                    bookmarks: Math.max(0, currentCount + (bookmarked ? 1 : -1)),
                  },
                };
              }),
            })),
          };
        },
      );
    },

    onError: (_err, _vars, ctx) => {
      queryClient.setQueryData(["bookmark", listingId], ctx?.prevBookmarked);
      queryClient.invalidateQueries({ queryKey: ["listing", listingId] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });

  return {
    isBookmarked,
    toggle: mutation.mutate,
    isLoading: mutation.isPending,
  };
}
