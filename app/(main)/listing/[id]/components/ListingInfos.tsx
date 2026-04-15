"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { millify } from "millify";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

import { getListingById, ListingSingle } from "@/actions/listing-actions";
import { PriceUnit } from "@/lib/prisma/generated/prisma/enums";

type Props = {
  listingId: string;
  title: string;
  price: number;
  unit?: string;
  date: string;
  city: string;
  lat: number;
  lng: number;
  likes?: number;
};

export const ListingInfos = ({
  listingId,
  title,
  price,
  unit,
  date,
  city,
  lat,
  lng,
  likes = 0,
}: Props) => {
  // Use useQuery to stay in sync with the bookmark mutation cache
  const { data: currentListing } = useQuery({
    queryKey: ["listing", listingId],
    queryFn: () => getListingById(listingId),
    enabled: !!listingId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    // Initial data from props to avoid loading state
    initialData: {
      id: listingId,
      title,
      price,
      priceUnit: (unit as PriceUnit) || "UNIT",
      createdAt: new Date(),
      description: "",
      images: [],
      location: { city, postalCode: "", lat, lng },
      category: { name: "", slug: "" },
      subCategory: null,
      product: null,
      owner: { id: "", name: "", image: "" },
      _count: {
        bookmarks: likes,
      },
    } as ListingSingle,
  });

  const displayLikes = currentListing?._count?.bookmarks ?? likes;

  return (
    <div className="bg-background relative -top-12 mx-auto flex w-full max-w-[95%] flex-col gap-4 rounded-xl border-2 p-4 shadow-2xl">
      {/* Title + Likes */}
      <div className="flex items-center justify-between">
        <div className="text-2xl font-semibold capitalize">{title}</div>
        <div className="flex items-center gap-1">
          <Heart className="h-4 w-4 fill-red-500 text-red-500" />
          <span className="text-sm font-medium">{millify(displayLikes)}</span>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center gap-2 text-xl font-medium">
        <span>{price} €</span>
        {unit && <span>/ {unit}</span>}
      </div>

      {/* Date */}
      <div className="text-muted-foreground">
        <span>{date}</span>
      </div>

      {/* City → Search */}
      <div>
        <Link href={`/search?geoLat=${lat}&geoLng=${lng}&geoRadiusKm=5`}>
          <Button variant="secondary" className="text-base">
            {city}
          </Button>
        </Link>
      </div>
    </div>
  );
};
