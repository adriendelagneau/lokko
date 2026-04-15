"use client";

import Image from "next/image";
import Link from "next/link";
import  { useRef } from "react";

import type { ListingFromGetListings } from "@/actions/listing-actions";
import { Skeleton } from "@/components/ui/skeleton";
import cloudinaryUrl from "@/utils/images/updateCloudinaryUrl";
import { preloadListingImages } from "@/utils/images/preload/preloadListingImages";

type SearchCardProps = {
  listing: ListingFromGetListings;
  /**
   * Optional: 'public' for /listing/[id] or 'user' for /user/listings/[id]
   * Defaults to 'public'
   */
  linkType?: "public" | "user";
};

const SearchCard = ({ listing, linkType = "public" }: SearchCardProps) => {
  const hasPreloaded = useRef(false);
  if (!listing) return null;

  const image = listing.images[0];

  const handlePreload = () => {
    if (hasPreloaded.current) return;
    hasPreloaded.current = true;

    preloadListingImages(listing.images.map((img) => img.url));
  };

  const href =
    linkType === "user"
      ? `/user/listings/${listing.id}`
      : `/listing/${listing.id}`;

  return (
    <Link
      href={href}
      onMouseEnter={handlePreload}
      onTouchStart={handlePreload}
      className="group block overflow-hidden rounded-xl border shadow-sm transition hover:shadow-md "
    >
      {/* Image (3/4) */}
      <div className="relative aspect-4/5 w-full overflow-hidden bg-muted">
        {image?.url ? (
          <Image
            src={cloudinaryUrl(image.url, {
              width: 275,
              height: 350,
              quality: 75,
            })}
            alt={image.altText ?? listing.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}
      </div>

      {/* Content (1/4) */}
      <div className="p-2">
        <h3 className="line-clamp-1 text-sm font-medium group-hover:text-primary">
          {listing.title}
        </h3>

        {listing.price != null && (
          <p className="text-sm font-semibold">
            {listing.price} / {listing.priceUnit}
          </p>
        )}

        {listing.location?.city && (
          <p className="text-xs text-muted-foreground">
            {listing.location.city}
          </p>
        )}
      </div>
    </Link>
  );
};

export default SearchCard;

export const SearchCardSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-xl border shadow-sm">
      <div className="aspect-4/5 w-full">
        <Skeleton className="h-full w-full flex flex-col items-center dark:text-background justify-center text-primary-foreground uppercase font-bold text-2xl" >lokko</Skeleton>
      </div>

      <div className="space-y-2 p-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
};
