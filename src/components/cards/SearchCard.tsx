import Image from "next/image";
import React from "react";

import type { ListingFromGetListings } from "@/actions/listing-actions";

type SearchCardProps = {
  listing: ListingFromGetListings;
};

const SearchCard = ({ listing }: SearchCardProps) => {
  if (!listing) {
    return null;
  }

  const image = listing.images?.[0];

  return (
    <div className="group w-full max-w-2xl rounded-md border shadow-lg p-4">
      <div className="flex gap-4">
        {/* Image */}
        {image?.url ? (
          <div className="relative h-[150px] w-[200px] overflow-hidden rounded-md">
            <Image
              src={image.url}
              alt={image.altText ?? listing.title}
              fill
              className="object-cover"
              sizes="100px"
            />
          </div>
        ) : (
          <div className="bg-muted text-muted-foreground flex h-[100px] w-[100px] items-center justify-center rounded-md text-xs">
            No image
          </div>
        )}

        {/* Content */}
        <div className="flex flex-col justify-between">
          <div>
            <h3 className="group-hover:text-primary line-clamp-1 text-lg font-semibold">
              {listing.title}
            </h3>

            {listing.price != null && (
              <p className="text-sm mt-2 ">
                {listing.price} / {listing.priceUnit}
              </p>
            )}
          </div>

          {listing.location?.city && (
            <p className="text-muted-foreground">{listing.location.city}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchCard;
