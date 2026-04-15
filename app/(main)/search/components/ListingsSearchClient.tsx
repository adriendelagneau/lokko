"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { Loader2, SearchX } from "lucide-react";

import { getListings, ListingFromGetListings } from "@/actions/listing-actions";
import { useInfiniteScrollObserver } from "@/hooks/useInfiniteScrollObserver";
import SearchCard, { SearchCardSkeleton } from "@/components/card/SearchCard";
import { useSearchState } from "@/hooks/use-search-state";

export default function ListingsClient() {
  const { queryObj } = useSearchState();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    status,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["listings", queryObj],
    queryFn: async ({ pageParam = 1 }) => {
      return getListings({
        ...queryObj,
        page: pageParam,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length + 1 : undefined,
  });

  // Infinite scroll observer
  useInfiniteScrollObserver({
    targetRef: loadMoreRef,
    enabled: hasNextPage && !isFetchingNextPage,
    onIntersect: fetchNextPage,
    rootMargin: "100px", // Increased rootMargin for smoother loading
  });

  // Initial loading
  if (status === "pending") {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SearchCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Error state
  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-destructive font-medium">
          Une erreur est survenue lors du chargement des annonces.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 text-sm text-primary hover:underline"
        >
          Réessayer
        </button>
      </div>
    );
  }

  const listings = data.pages
    .flatMap((page) => page.listings)
    .filter((listing): listing is ListingFromGetListings => listing !== null);

  // Empty state
  if (listings.length === 0 && !isFetching) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
        <SearchX className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">Aucun résultat</h3>
        <p className="text-muted-foreground">
          Essayez de modifier vos filtres ou votre zone de recherche.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {listings.map((listing) => (
          <SearchCard key={listing.id} listing={listing} />
        ))}
        
        {isFetchingNextPage && (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <SearchCardSkeleton key={`skeleton-${i}`} />
            ))}
          </>
        )}
      </div>

      <div ref={loadMoreRef} className="flex justify-center py-4">
        {isFetchingNextPage ? (
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        ) : hasNextPage ? (
          <div className="h-1" />
        ) : listings.length > 0 ? (
          <p className="text-sm text-muted-foreground">Plus aucun résultat</p>
        ) : null}
      </div>
    </div>
  );
}
