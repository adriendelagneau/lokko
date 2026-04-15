"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import cloudinaryUrl from "@/utils/images/updateCloudinaryUrl";
import ImagesSkeleton from "@/components/ImagesSkeleton";
import { useImageModal } from "@/store/useImageModal";
import { useIsMobile } from "@/hooks/use-mobile";
import type { ImageItem } from "../type";

type Props = {
  images: ImageItem[];
};

export default function ImageModalMobile({ images }: Props) {
  const isMobile = useIsMobile();
  const { isOpen, close, index } = useImageModal();

  const [loadedImages, setLoadedImages] = useState<boolean[]>(
    Array(images.length).fill(false)
  );

  const allLoaded = loadedImages.every(Boolean);

  if (!isOpen || !isMobile) return null;

  return (
    <div className="bg-background fixed inset-0 z-[100]">
      {/* ❌ Close */}
      <button
        onClick={close}
        className="text-primary-foreground absolute top-4 right-4 z-50 rounded-full bg-black/70 p-2"
      >
        <X size={24} />
      </button>

      {/* ✅ GLOBAL Skeleton (no flashing anywhere) */}
      {!allLoaded && (
        <div className="absolute inset-0 z-40">
          <ImagesSkeleton />
        </div>
      )}

      {/* 📱 Scroll vertical */}
      <div className="h-full overflow-y-auto pt-4">
        {images.map((img, i) => (
          <div key={i} className="relative mb-4 w-full last:mb-0">
            <div className="relative h-[80vh] w-full">
              <Image
                src={cloudinaryUrl(img.url, {
                  width: 1200,
                  quality: 85,
                })}
                alt={img.altText ?? "Image"}
                fill
                sizes="100vw"
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
