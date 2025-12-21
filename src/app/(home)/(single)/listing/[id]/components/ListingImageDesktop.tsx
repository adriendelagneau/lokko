"use client";

import Image from "next/image";

import { useImageModal } from "@/lib/store/useImagesModal";

import { ImageItem } from "./type";

type Props = {
  images: ImageItem[];
};

export function ListingImagesDesktop({ images }: Props) {
  const openAt = useImageModal((s) => s.openAt);

  if (images.length === 0) return null;

  const displayImages = images.slice(0, 3);

  return (
    <div className="grid h-[420px] grid-cols-2 gap-2 overflow-hidden rounded-xl">
      {/* Left big image */}
      <div
        className={`relative cursor-pointer ${
          images.length === 1 ? "col-span-2" : "row-span-2"
        }`}
        onClick={() => openAt(0)}
      >
        <Image
          src={displayImages[0].url}
          alt={displayImages[0].altText ?? ""}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right images */}
      {displayImages.slice(1).map((img, i) => {
        const index = i + 1;
        const isLast = index === 2 && images.length > 3;

        return (
          <div
            key={index}
            className="relative cursor-pointer"
            onClick={() => openAt(index)}
          >
            <Image
              src={img.url}
              alt={img.altText ?? ""}
              fill
              className="object-cover"
            />

            {isLast && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-lg font-semibold text-white">
                +{images.length - 2} photos
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
