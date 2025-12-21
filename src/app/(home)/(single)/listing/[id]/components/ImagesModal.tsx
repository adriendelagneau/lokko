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

export function ImagesModal({ images }: Props) {
  const { open, index, close, setIndex } = useImageModal();
  const [api, setApi] = useState<CarouselApi | null>(null);

  // 🔥 sync embla → zustand
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setIndex(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, setIndex]);

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="h-screen w-screen max-w-none bg-black p-0">
        <DialogTitle className="sr-only">Images</DialogTitle>

        {/* ❌ Close */}
        <button
          onClick={close}
          className="absolute top-4 right-4 z-50 text-white"
        >
          <X size={28} />
        </button>

        {/* 🔢 Counter */}
        <div className="absolute top-4 left-4 z-50 text-sm text-white">
          {index + 1} / {images.length}
        </div>

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
      </DialogContent>
    </Dialog>
  );
}
