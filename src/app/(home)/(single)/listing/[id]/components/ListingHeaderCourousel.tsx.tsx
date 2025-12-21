"use client";

import { ArrowLeft, Heart, Share2, ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";
import { useImageModal } from "@/lib/store/useImageViewer";

export type ImageItem = {
  url: string;
  altText?: string;
};

type Props = {
  images: ImageItem[];

  likeCount?: number;
};

export function ListingHeaderCarousel({ images }: Props) {
  const openModal = useImageModal((s) => s.open);

  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="relative w-full overflow-hidden lg:hidden">
      {/* 🔙 Back */}
      <Link href="/">
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 left-4 z-10 rounded-full"
          onClick={() => {}}
        >
          <ArrowLeft />
        </Button>
      </Link>

      {/* ❤️ Like */}
      <Button
        variant="secondary"
        size="icon"
        className="absolute top-4 right-14 z-10 rounded-full"
      >
        <Heart />
      </Button>

      {/* 🔗 Share */}
      <Button
        variant="secondary"
        size="icon"
        className="absolute top-4 right-4 z-10 rounded-full"
        onClick={() => {}}
      >
        <Share2 />
      </Button>

      {/* 📸 Carousel */}
      <Carousel setApi={setApi}>
        <CarouselContent>
          {images.map((img, index) => (
            <CarouselItem key={index} className="basis-full">
              <button
                onClick={() => openModal(index)}
                className="relative h-[45vh] w-full"
              >
                <Image
                  src={img.url}
                  alt={img.altText ?? "Image de l'annonce"}
                  fill
                  priority={index === 0}
                  className="object-cover"
                />
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* 📊 Counter */}
      <div className="absolute right-4 bottom-4 z-10 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs text-white">
        <ImageIcon className="h-4 w-4" />
        {current}/{images.length}
      </div>
    </div>
  );
}
