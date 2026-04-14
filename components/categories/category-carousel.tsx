"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Category } from "@/actions/category-actions";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export const CategoryCarousel = ({
  categories,
}: {
  categories: Category[];
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

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

    const updateCarouselState = () => {
      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap() + 1);
    };

    updateCarouselState();
    api.on("select", updateCarouselState);
  }, [api]);

  const currentCategory = searchParams.get("category");

  return (
    <div className="relative my-4 h-10 w-full px-1 lg:hidden">
      {/* Left Gradient */}
      <div
        className={cn(
          "from-background pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-12 bg-linear-to-r to-transparent transition-opacity duration-300",
          current === 1 ? "opacity-0" : "opacity-100",
        )}
      />

      <Carousel
        setApi={setApi}
        opts={{ align: "start", dragFree: true }}
        className="w-full px-4"
      >
        <CarouselContent className="-ml-2">
          {categories.map((category) => {
            const isActive = currentCategory === category.slug;
            return (
              <CarouselItem key={category.id} className="basis-auto pl-2">
                <Button
                  variant={"default"}
                  size="sm"
                  onClick={() => onSelect(category.slug)}
                  className={cn(
                    "h-8 px-4 text-xs font-semibold capitalize transition-all",
                    isActive && "ring-primary/20 ring-2",
                  )}
                >
                  {category.name}
                </Button>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      {/* Right Gradient */}
      <div
        className={cn(
          "from-background pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-12 bg-linear-to-l to-transparent transition-opacity duration-300",
          current === count ? "opacity-0" : "opacity-100",
        )}
      />
    </div>
  );
};
