// utils/preloadListingImages.ts
import cloudinaryUrl from "@/utils/images/updateCloudinaryUrl";
import { preloadImage } from "./preloadImage";



export function preloadListingImages(imageUrls: string[]) {
  const imagesToPreload = imageUrls.slice(1, 3);

  if (imagesToPreload.length === 0) return;

  imagesToPreload.forEach((url) => {
    preloadImage(
      cloudinaryUrl(url, {
        width: 270, // smaller size for fast preload
        height: 500,
        crop: "fill",
        quality: 60,
        format: "auto",
      })
    );
  });
}