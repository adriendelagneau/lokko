"use client";

import { Heart } from "lucide-react";

import { useBookmark } from "@/hooks/use-bookmark";
import { cn } from "@/lib/utils";

type Props = {
  listingId: string;
};

export function BookmarkButton({
  listingId,
}: Props) {
  const { isBookmarked, toggle, isLoading } = useBookmark(listingId);

  return (
        <button className="cursor-pointer rounded-full p-1 w-9 h-9 bg-background hover:bg-background/80 flex items-center justify-center shadow-md border border-transparent hover:border-border transition"
      onClick={(e) => {
        e.preventDefault(); // safe inside links
        toggle();
      }}
      disabled={isLoading}
      aria-pressed={isBookmarked}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition",
          isBookmarked && "fill-red-500 text-red-500"
        )}
      />
    </button>
  );
}
