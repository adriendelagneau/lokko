"use client";

import { useEffect } from "react";
import { ListingSingle } from "@/actions/listing-actions";
import { Category } from "@/actions/category-actions";
import { ListingHeaderCarousel } from "./ListingHeaderCarousel";
import ImageModalMobile from "./modals/ImageMobileModal";
import { ListingImagesDesktop } from "./ListingImageDesktop";
import { ImagesModalDesktop } from "./modals/ImagesModal";
import { ListingInfos } from "./ListingInfos";
import { ListingDetails } from "./ListingDescription";
import SingleMap from "./map/SingleMap";
import { ListingUserInfo } from "./ListingUserInfos";
import Categories from "@/components/categories/Categories";
import { useImageModal } from "@/store/useImageModal";

type Props = {
  listing: ListingSingle;
  categories: Category[];
  userId: string | null;
};

export default function ListingResponsive({
  listing,
  categories,
  userId,
}: Props) {
  const closeDesktop = useImageModal((s) => s.close);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const handler = () => {
      if (!mq.matches) closeDesktop();
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [closeDesktop]);
  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl pt-24">
      {/* Categories at top, hidden on mobile */}
      <div className="hidden px-4 lg:block">
        <Categories categories={categories} />
      </div>

      <div className="grid gap-8 px-0 lg:mt-8 lg:grid-cols-[1fr_350px] lg:px-4">
        <div className="flex flex-col gap-8">
          {/* MOBILE: Header Carousel */}
          <div className="block lg:hidden">
            <ListingHeaderCarousel
              images={listing.images}
              listingId={listing.id}
            />
            <ImageModalMobile images={listing.images} />
          </div>

          {/* DESKTOP: Images Grid */}
          <div className="hidden lg:block">
            <ListingImagesDesktop
              images={listing.images}
              listingId={listing.id}
            />
            <ImagesModalDesktop images={listing.images} title={listing.title} />
          </div>

          <div className="flex flex-col gap-8 px-4 lg:px-0">
            <ListingInfos
              listingId={listing.id}
              title={listing.title}
              price={listing.price}
              unit={listing.priceUnit}
              city={listing.location.city}
              lat={listing.location.lat}
              lng={listing.location.lng}
              likes={listing._count.bookmarks}
              date={listing.createdAt.toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            />

            <div className="grid gap-8 lg:grid-cols-1">
              <ListingDetails description={listing.description} />
              <SingleMap listing={listing} />
            </div>

            {/* MOBILE: User Info after content */}
            <div className="lg:hidden">
              <ListingUserInfo listing={listing} />
            </div>
          </div>
        </div>

        {/* DESKTOP: Sticky Sidebar */}
        <aside className="relative hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <ListingUserInfo listing={listing} />
            

          </div>
        </aside>
      </div>
    </div>
  );
}
