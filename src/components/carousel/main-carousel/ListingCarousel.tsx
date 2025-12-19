"use client";

import * as React from "react";

import { ListingCard } from "@/actions/listing-actions";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

import { ListingCarouselCard } from "./ListingCarouselCard";

type ListingCarouselProps = {
  listings: ListingCard[];
};

export function ListingCarousel({ listings }: ListingCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  if (!listings.length) return null;

  return (
    <div className="relative mx-auto my-6 w-full max-w-6xl">
      {/* Left gradient */}
      <div
        className={cn(
          "from-background pointer-events-none absolute top-0 bottom-0 left-10 z-10 w-12 bg-gradient-to-r to-transparent",
          current === 1 && "hidden"
        )}
      />

      <Carousel
        setApi={setApi}
        opts={{ align: "start", dragFree: true }}
        className="w-full px-10"
      >
        <CarouselContent className="-ml-4">
          {listings.map((listing) => (
            <CarouselItem
              key={listing.id}
              className="basis-[80%] pl-4 sm:basis-[45%] md:basis-[30%] lg:basis-[25%]"
            >
              <ListingCarouselCard listing={listing} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Right gradient */}
      <div
        className={cn(
          "from-background pointer-events-none absolute top-0 right-10 bottom-0 z-10 w-12 bg-gradient-to-l to-transparent",
          current === count && "hidden"
        )}
      />
    </div>
  );
}
