"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";
import Image from "next/image";

import { useImageModal } from "@/store/useImageModal";
import cloudinaryUrl from "@/utils/images/updateCloudinaryUrl";


import { ShareButton } from "./buttons/share-button";
import { BookmarkButton } from "./buttons/BookmarkButton";
import ImagesSkeleton from "@/components/ImagesSkeleton";

type ImageItem = {
 url: string;
 altText?: string | null;
};


type Props = {
  images: ImageItem[];
  listingId: string;
};

export function ListingImagesDesktop({ images, listingId }: Props) {
  const openAt = useImageModal((s) => s.openAt);
  const [loadedCount, setLoadedCount] = useState(0);

  if (!images || images.length === 0) return null;

  const displayImages = images.slice(0, 3);
  const allLoaded = loadedCount >= displayImages.length;

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* 🔝 Top actions */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <BookmarkButton listingId={listingId} />
        <ShareButton
          url={`${process.env.NEXT_PUBLIC_URL}/listing/${listingId}`}
        />
      </div>

      {/* 🖼️ Images */}
      <div className="relative flex h-[480px] gap-2">
        {displayImages.map((img, index) => (
          <div
            key={index}
            className="relative h-full flex-1 cursor-pointer overflow-hidden rounded-lg"
            onClick={() => openAt(index)}
          >
            {/* Skeleton placeholder */}
            {!allLoaded && <ImagesSkeleton />}

            {/* Real image */}
            <Image
              src={cloudinaryUrl(img.url, {
                width: 600,
                height: 900,
                crop: "fill",
                quality: 80,
                format: "webp",
              })}
              alt={img.altText ?? ""}
              fill
              loading="eager"
              priority={index === 0}
              sizes="(max-width: 1024px) 100vw, 33vw"
              className={`object-cover transition-opacity duration-500 ${
                allLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setLoadedCount((prev) => prev + 1)}
            />
          </div>
        ))}
      </div>

      {/* 📸 Bottom action */}
      <button
        onClick={() => openAt(0)}
        className="absolute right-4 bottom-4 z-10 flex items-center gap-2 rounded-full bg-black/70 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-black/80"
      >
        <ImageIcon size={18} />
        Voir les {images.length} photos
      </button>
    </div>
  );
}
