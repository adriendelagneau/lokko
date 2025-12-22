"use client";

import { Star } from "lucide-react";
import Image from "next/image";

import type { ListingSingle } from "@/actions/listing-actions";
import { Button } from "@/components/ui/button";

type Props = {
  listing: ListingSingle;
};

export function ListingUserInfo({ listing }: Props) {
  const { owner} = listing;

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-white p-4 shadow-sm">
      {/* Seller Info */}
      <div className="flex items-center gap-4">
        <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gray-200">
          {owner.image ? (
            <Image
              src={owner.image}
              alt={owner.name}
              fill
              className="object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-gray-500">
              {owner.name[0]}
            </span>
          )}
        </div>
        <div className="flex flex-col">
          <span className="font-medium">{owner.name}</span>
          <span className="flex items-center gap-1 text-sm text-gray-500">
            <Star className="h-4 w-4 text-yellow-500" />
            {owner.ratingAverage?.toFixed(1)} ({owner.ratingCount})
          </span>
        </div>
      </div>

    

      {/* Contact Button */}
      <Button variant="default" className="w-full">
        Contacter le vendeur
      </Button>
    </div>
  );
}
