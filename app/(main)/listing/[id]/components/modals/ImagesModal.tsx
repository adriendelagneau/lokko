"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ImagesSkeleton from "@/components/ImagesSkeleton";
import { useImageModal } from "@/store/useImageModal";
import { useIsMobile } from "@/hooks/use-mobile";

import { ImageItem } from "../type";
import cloudinaryUrl from "@/utils/images/updateCloudinaryUrl";

type Props = {
  title: string;
  images: ImageItem[];
};

export function ImagesModalDesktop({ title, images }: Props) {
  const isMobile = useIsMobile();
  const { isOpen, index, close, setIndex } = useImageModal();
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [loadedImages, setLoadedImages] = useState<boolean[]>(
    Array(images.length).fill(false)
  );

  const allLoaded = loadedImages.every(Boolean);

  // Use a key to force re-render when index changes, resetting the loaded state
  const carouselKey = `${isOpen}-${index}`;

  /* 🔁 sync carousel → zustand */
  useEffect(() => {
    if (!api) return;

    const onSelect = () => setIndex(api.selectedScrollSnap());
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api, setIndex]);

  /* 🔁 sync zustand → carousel */
  useEffect(() => {
    if (api) api.scrollTo(index);
  }, [index, api]);

  if (isMobile) return null;

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent
        fullscreen
        className="bg-background h-screen w-screen max-w-none p-12"
      >
        <DialogTitle className="">{title}</DialogTitle>
        <DialogDescription className="sr-only">
          View full size images for {title}
        </DialogDescription>
        {/* ❌ Close */}
        <button
          onClick={close}
          className="text-secondary-foreground dark:text-primary-foreground absolute top-4 right-4 z-50"
        >
          <X size={28} />
        </button>

        <div className="flex h-full items-center">
          {/* 🖼️ LEFT – carousel */}
          <div className="relative flex-1">
            <Carousel
              key={carouselKey}
              opts={{ startIndex: index }}
              setApi={setApi}
              className="mx-auto h-full w-[460px]"
            >
              <CarouselContent>
                {images.map((img, i) => (
                  <CarouselItem key={i} className="relative h-[70vh]">
                    {!allLoaded && (
                      <div className="absolute inset-0 z-10">
                        <ImagesSkeleton />
                      </div>
                    )}
                    <Image
                      src={cloudinaryUrl(img.url, { height: 640, width: 500 })}
                      alt={img.altText ?? ""}
                      fill
                      sizes="50vw"
                      className={`object-contain transition-opacity duration-300 ${
                        loadedImages[i] ? "opacity-100" : "opacity-0"
                      }`}
                      onLoad={() =>
                        setLoadedImages((prev) => {
                          const updated = [...prev];
                          updated[i] = true;
                          return updated;
                        })
                      }
                      priority={i === index}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          {/* 📌 RIGHT – thumbnails */}
          <div className="flex h-full w-1/2 flex-col items-center justify-center gap-6 p-4">
            {/* Counter */}
            <div className="text-secondary-foreground mb-4 text-center">
              {index + 1} / {images.length}
            </div>

            <div className="mx-auto grid h-48 w-full max-w-md grid-cols-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`relative aspect-3/4 h-full overflow-hidden rounded-md border-2 transition ${
                    index === i
                      ? "border-primary border-4"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={cloudinaryUrl(img.url, { height: 150, width: 109 })}
                    alt={img.altText ?? ""}
                    fill
                    sizes="(max-width: 768px) 33vw, 150px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
