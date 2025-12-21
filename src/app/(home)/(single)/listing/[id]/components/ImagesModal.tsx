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
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useImageModal } from "@/lib/store/useImagesModal";

import { ImageItem } from "./type";

type Props = {
  images: ImageItem[];
};

export function ImagesModalDesktop({ images }: Props) {
  const { open, index, close, setIndex } = useImageModal();
  const [api, setApi] = useState<CarouselApi | null>(null);

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

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent fullscreen className="h-screen w-screen max-w-none bg-black p-0">
        <DialogTitle className="sr-only">Images</DialogTitle>
        {/* ❌ Close */}
        <button
          onClick={close}
          className="absolute top-4 right-4 z-50 text-white"
        >
          <X size={28} />
        </button>

        <div className="flex h-full">
          {/* 🖼️ LEFT – carousel */}
          <div className="relative flex-1">
            <Carousel
              opts={{ startIndex: index }}
              setApi={setApi}
              className="h-full w-full"
            >
              <CarouselContent>
                {images.map((img, i) => (
                  <CarouselItem key={i} className="relative h-screen">
                    <Image
                      src={img.url}
                      alt={img.altText ?? ""}
                      fill
                      className="object-contain"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          {/* 📌 RIGHT – thumbnails */}
          <div className="w-64 overflow-y-auto border-l border-white/10 bg-black/90 p-4">
            {/* Counter */}
            <div className="mb-4 text-center text-sm text-white/80">
              {index + 1} / {images.length}
            </div>

            <div className="flex flex-col gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`relative aspect-[3/4] overflow-hidden rounded-md border-2 transition ${
                    index === i
                      ? "border-white"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.altText ?? ""}
                    fill
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
