"use client";

import { Heart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTimeAgo } from "next-timeago";

import { ListingCard } from "@/actions/listing-actions";
import { Badge } from "@/components/ui/badge";

type Props = { listing: ListingCard };

export function ListingCarouselCard({ listing }: Props) {
  const image = listing.images[0];
  const { TimeAgo } = useTimeAgo();



  return (
    <Link href={`/listing/${listing.id}`}>
      <article className="group bg-background flex h-full w-52 flex-col overflow-hidden rounded-xl">
        {/* Seller */}
        <div className="flex items-center gap-2 py-1">
          <Badge className="bg-primary flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold text-white">
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

        {/* Image */}
        <div className="bg-muted relative h-72 w-52 overflow-hidden">
          {image ? (
            <Image
              src={image.url}
              alt={image.altText ?? listing.title}
              fill
              sizes="(max-width: 768px) 80vw, 25vw"
              className="object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
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
          <h3 className="line-clamp-2 text-xl leading-snug font-semibold">
            {listing.title}
          </h3>
          <p className="text-lg font-semibold">
            {listing.price.toLocaleString("fr-FR")} €
            {listing.priceUnit !== "UNIT" && (
              <span className="text-muted-foreground">
                {" "}
                / {listing.priceUnit.toLowerCase()}
              </span>
            )}
          </p>
          <p className="text-sm">
            {listing.location.city} ({listing.location.postalCode})
          </p>
          <TimeAgo date={listing.createdAt} locale="fr" />
        </div>
      </article>
    </Link>
  );
}
