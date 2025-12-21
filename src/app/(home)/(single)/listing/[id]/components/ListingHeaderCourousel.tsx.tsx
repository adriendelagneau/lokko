"use client";

import { ArrowLeft, CameraIcon, HeartIcon, ImageIcon, Share2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import type { ImageItem } from "./types";

type ListingHeaderProps = {
  images: ImageItem[];
  onBack?: () => void;
  onShare?: () => void;
};

export function ListingHeaderCarousel({
  images,
  onBack,
  onShare,
}: ListingHeaderProps) {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(1);
  const total = images.length;

  useEffect(() => {
    if (!api) return;

    // init
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="relative w-full overflow-hidden">
      {/* 🔙 Back */}
      <Button
        variant="secondary"
        size="icon"
        className="absolute top-4 left-4 z-10 rounded-full"
        onClick={onBack}
      >
        <ArrowLeft />
      </Button>

      <div className="absolute top-4 right-4 z-10 flex gap-2">
        {/* ❤️ Like */}
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full"
          onClick={() => {}}
        >
          <HeartIcon />
        </Button>

        {/* 🔗 Share */}
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full"
          onClick={onShare}
        >
          <Share2 />
        </Button>
      </div>

   {/* 📸 Carousel */}
      <Carousel setApi={setApi}>
        <CarouselContent>
          {images.map((img, index) => (
            <CarouselItem key={index} className="basis-full">
              <div className="relative h-[40vh] w-full">
                <Image
                  src={img.url}
                  alt={img.altText ?? "Image de l'annonce"}
                  fill
                  priority={index === 0}
                  className="object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* 🧮 Image counter */}
      {total > 1 && (
        <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs text-white">
          <CameraIcon className="h-4 w-4" />
          <span>
            {current} /  {total}
          </span>
        </div>
      )}
    </div>
  );
}
