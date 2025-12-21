"use client";

import { X } from "lucide-react";
import Image from "next/image";

import { useImageModal } from "@/lib/store/useImageViewer";
import { cn } from "@/lib/utils";

import { ImageItem } from "./ListingHeaderCourousel.tsx"; 

type Props = {
  images: ImageItem[];
};

export default function ImageModal({ images }: Props) {
  const { isOpen, close, startIndex } = useImageModal();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* ❌ Close */}
      <button
        onClick={close}
        className="absolute top-4 right-4 z-50 rounded-full bg-black/70 p-2 text-white"
      >
        <X />
      </button>

      {/* 📱 Scroll vertical */}
      <div className="h-full overflow-y-auto">
        {images.map((img, index) => (
          <div
            key={index}
            className={cn(
              "relative w-full",
              index === startIndex ? "scroll-mt-0" : ""
            )}
          >
            <div className="relative h-[100vh] w-full">
              <Image
                src={img.url}
                alt={img.altText ?? "Image"}
                fill
                className="object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
