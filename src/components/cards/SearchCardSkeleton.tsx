"use client";

import { Skeleton } from "@/components/ui/skeleton";

export const SearchCardSkeleton = () => {
  return (
    <div className="group w-full max-w-2xl rounded-md border shadow-lg p-4 animate-pulse">
      <div className="flex gap-4">
        {/* Image placeholder */}
        <Skeleton className="h-[150px] w-[200px] rounded-md bg-muted" />

        {/* Content placeholder */}
        <div className="flex flex-1 flex-col justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4 rounded-md bg-muted" /> {/* title */}
            <Skeleton className="h-4 w-1/4 rounded-md bg-muted" /> {/* price */}
          </div>

          <Skeleton className="h-4 w-1/3 rounded-md bg-muted" /> {/* location */}
        </div>
      </div>
    </div>
  );
};
