"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Category } from "@/lib/prisma/generated/prisma/client";
import { cn } from "@/lib/utils";

export const CategoryCarousel = ({
  categories,
}: {
  categories: Category[];
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const activeCategory = searchParams.get("category");

  const onSelect = (value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("category", value);
      params.delete("page");
    } else {
      params.delete("category");
      params.delete("page");
    }

    router.push(`/search?${params.toString()}`);
  };

  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const isSearchPage = pathname === "/search";

  return (
    <div className="relative my-4 w-full px-5 lg:hidden">
      {/* Left Gradient */}
      <div
        className={cn(
          "from-background pointer-events-none absolute top-0 bottom-0 left-12 z-10 w-12 bg-gradient-to-r to-transparent",
          current === 1 && "hidden"
        )}
      />

      <Carousel
        setApi={setApi}
        opts={{ align: "start", dragFree: true }}
        className="w-full px-12"
      >
        <CarouselContent className="-ml-2">
          {/* "All" Option */}
          {isSearchPage && (
            <CarouselItem className="basis-auto pl-2">
              <Button
                variant={!activeCategory ? "default" : "ghost"}
                onClick={() => onSelect(null)}
                className="px-3 py-1 text-sm"
              >
                All
              </Button>
            </CarouselItem>
          )}

          {categories.map((category) => {
            const isActive = activeCategory === category.slug;

            return (
              <CarouselItem key={category.id} className="basis-auto pl-3">
                <Button
                  variant={isActive ? "default" : "ghost"}
                  onClick={() => onSelect(category.slug)}
                  className="px-3 py-1  capitalize"
                >
                  {category.name}
                </Button>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="left-0 z-20 cursor-pointer" />
        <CarouselNext className="right-0 z-20 cursor-pointer" />
      </Carousel>

      {/* Right Gradient */}
      <div
        className={cn(
          "from-background pointer-events-none absolute top-0 right-12 bottom-0 z-10 w-12 bg-gradient-to-l to-transparent",
          current === count && "hidden"
        )}
      />
    </div>
  );
};
