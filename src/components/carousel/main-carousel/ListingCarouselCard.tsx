"use client";

import { Heart, Star } from "lucide-react";
import Image from "next/image";
import { format, register } from "timeago.js";
import fr from "timeago.js/lib/lang/fr";

import { ListingCard } from "@/actions/listing-actions";
import { Badge } from "@/components/ui/badge";

// register locale once
register("fr", fr);

type Props = {
  listing: ListingCard;
};

export function ListingCarouselCard({ listing }: Props) {
  const image = listing.images[0];

  return (
    <article className="group bg-background flex h-full w-60 flex-col overflow-hidden rounded-xl">
      {/* Seller */}
      <div className="text-muted-foreground flex items-center gap-2 p-1">
        <Badge className="bg-primary flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold text-white">
          {listing.owner.name?.charAt(0).toUpperCase()}
        </Badge>

        <p className="truncate text-sm capitalize">{listing.owner.name}</p>

        <div className="ml-auto flex items-center gap-1 text-sm">
          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          <span>
            {listing.owner.ratingAverage} (
            {listing.owner.ratingCount})
          </span>
        </div>
      </div>

      {/* Image wrapper – FIXED HEIGHT (important) */}
      <div className="bg-muted relative h-72 w-full overflow-hidden">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText ?? listing.title}
            fill
            sizes="(max-width: 768px) 80vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
            Aucune image
          </div>
        )}

        {/* Like */}
        <button className="absolute top-2 right-2 z-10 cursor-pointer rounded-full bg-white/90 p-1.5 shadow transition hover:bg-white">
          <Heart className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-0.5 pt-2">
        {/* Title */}
        <h3 className="line-clamp-2 text-xl leading-snug font-semibold">
          {listing.title}
        </h3>

        {/* Price */}
        <p className="text-lg font-semibold">
          {listing.price.toLocaleString("fr-FR")} €
          {listing.priceUnit !== "UNIT" && (
            <span className="text-muted-foreground">
              {" / "}
              {listing.priceUnit.toLowerCase()}
            </span>
          )}
        </p>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Location */}
        <p className="text-muted-foreground ">
          {listing.location.city} ({listing.location.postalCode})
              </p>
              <p className="text-muted-foreground">
                  
        {format(listing.createdAt, "fr")}
              </p>
      </div>
    </article>
  );
}
