"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTimeAgo } from "next-timeago";

import { Badge } from "@/components/ui/badge";
import cloudinaryUrl from "@/utils/images/updateCloudinaryUrl";
import { preloadListingImages } from "@/utils/images/preload/preloadListingImages";
import ImagesSkeleton from "@/components/ImagesSkeleton";

import { ListingFromGetListings } from "@/actions/listing-actions";

type Props = { listing: ListingFromGetListings };

export function ListingCarouselCard({ listing }: Props) {
  const { TimeAgo } = useTimeAgo();
  const hasPreloaded = useRef(false);
  const [isLoading, setIsLoading] = useState(true);

  if (!listing) return null;

  const image = listing.images[0];

  const handlePreload = () => {
    if (hasPreloaded.current) return;
    hasPreloaded.current = true;

    preloadListingImages(listing.images.map((img) => img.url));
  };

  return (
    <Link
      href={`/listing/${listing.id}`}
      onMouseEnter={handlePreload} // Desktop hover
      onTouchStart={handlePreload} // Mobile touch
    >
      <article className="group bg-background flex h-full w-44 lg:w-52 flex-col overflow-hidden rounded-xl mr-6">
        {/* Seller */}
        <div className="flex items-center gap-1 py-1">
          <Badge className="bg-primary flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold text-white">
            {listing.owner.name?.charAt(0).toUpperCase()}
          </Badge>

          <p className="max-w-28 truncate text-sm capitalize">
            {listing.owner.name}
          </p>
        </div>

        {/* Image */}
        <div className="bg-muted relative h-64 w-48  lg:h-72 lg:w-52  overflow-hidden">
          {image ? (
            <>
              <Image
                src={cloudinaryUrl(image.url, { width: 208, height: 288 })}
                alt={image.altText ?? listing.title}
                fill
                sizes="(max-width: 768px) 80vw, 25vw"
                loading="eager"
                className={`rounded-lg object-cover transition-transform duration-300 group-hover:scale-105 ${
                  isLoading ? "invisible" : "visible"
                }`}
                onLoad={() => setIsLoading(false)}
              />
              {isLoading && <ImagesSkeleton />}
            </>
          ) : (
            <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
              Aucune image
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-0.5 pt-2">
          <h3 className="line-clamp-1 w-48 text-sm lg:text-md leading-snug font-semibold">
            {listing.title}
          </h3>
          <p className="text-md">
            {listing.price.toLocaleString("fr-FR")} €
            {listing.priceUnit !== "UNIT" && (
              <span>
                {" / "}
                {listing.priceUnit.toLowerCase()}
              </span>
            )}
          </p>
          <p className="text-sm">
            {listing.location.city} ({listing.location.postalCode})
          </p>
          <p className="text-sm">
            <TimeAgo date={listing.createdAt} locale="fr" />
          </p>
        </div>
      </article>
    </Link>
  );
}
