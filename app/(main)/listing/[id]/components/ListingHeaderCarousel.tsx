"use client";

import { ArrowLeft, ImageIcon } from "lucide-react";
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
import { useImageModal } from "@/store/useImageModal";
import cloudinaryUrl from "@/utils/images/updateCloudinaryUrl";
import { BookmarkButton } from "./buttons/BookmarkButton";
import { ShareButton } from "./buttons/share-button";

type ImageItem = {
 url: string;
 altText?: string | null;
};


type Props = {
  images: ImageItem[];
  listingId: string;
  likeCount?: number;
};


export function ListingHeaderCarousel({ images, listingId }: Props) {
  const openAt = useImageModal((s) => s.openAt);

  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1);
    };
    api.on("select", handleSelect);
    handleSelect();
  }, [api]);

  return (
    <div className="relative w-full overflow-hidden lg:hidden">
      <Link href="/">
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 left-4 z-10 rounded-full"
        >
          <ArrowLeft />
        </Button>
      </Link>

      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <BookmarkButton listingId={listingId} />
        <ShareButton
          url={`${process.env.NEXT_PUBLIC_URL}/listing/${listingId}`}
        />
      </div>

      {/* 📸 Carousel */}
      <Carousel setApi={setApi}>
        <CarouselContent>
          {images.map((img, index) => (
            <CarouselItem key={index} className="basis-full">
              <button
                onClick={() => openAt(index)}
                className="relative h-[45vh] w-full"
              >
                <Image
                  src={cloudinaryUrl(img.url, {
                    width: 800,
                    height: 600,
                    crop: "fill",
                    quality: 80,
                  })}
                  alt={img.altText ?? "Image de l'annonce"}
                  fill
                  sizes="(max-width: 800px) 100vw, 100vw"
                  className="h-auto w-full object-cover"
                  priority={index === 0}
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
