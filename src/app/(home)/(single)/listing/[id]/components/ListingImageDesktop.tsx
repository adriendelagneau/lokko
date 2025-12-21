"use client";

import { Heart, Share2, ImageIcon } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { useImageModal } from "@/lib/store/useImagesModal";

import type { ImageItem } from "./type";

type Props = {
  images: ImageItem[];
  likesCount?: number;
  isLiked?: boolean;
  onLike?: () => void;
  onShare?: () => void;
};

export function ListingImagesDesktop({
  images,
  likesCount = 0,
  isLiked = false,
  onLike,
  onShare,
}: Props) {
  const openAt = useImageModal((s) => s.openAt);

  if (images.length === 0) return null;

  const displayImages = images.slice(0, 3);

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* 🔝 Top actions */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        {/* Like */}
        <Button
          size="icon"
          variant="secondary"
          className="rounded-full"
          onClick={onLike}
        >
          <Heart
            className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
          />
        </Button>

        {likesCount > 0 && (
          <span className="self-center text-sm font-medium text-white drop-shadow">
            {likesCount}
          </span>
        )}

        {/* Share */}
        <Button
          size="icon"
          variant="secondary"
          className="rounded-full"
          onClick={onShare}
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </div>

      {/* 🖼️ Images */}
      <div className="grid h-[420px] grid-cols-3 gap-2">
        {displayImages.map((img, index) => (
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
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* 📸 Bottom action */}
      <button
        onClick={() => openAt(0)}
        className="absolute bottom-4 right-4 z-10 flex  items-center gap-2 rounded-full bg-black/70 px-4 py-2 text-sm font-medium text-white backdrop-blur"
      >
        <ImageIcon size={18} />
        Voir les {images.length} photos
      </button>
    </div>
  );
}
