import { getCategories } from "@/actions/category-actions";
import { getListingById, ListingSingle } from "@/actions/listing-actions";
import { BreadcrumbSingle } from "@/components/bread-crump/BreadCrumpSingle";
import { CategoryCarousel } from "@/components/carousel/category-carousel";
import Categories from "@/components/categories/Categories";
import SingleMap from "@/components/map/SingleMap";

import ImageModalMobile from "./components/ImageMobileModal";
import { ImagesModal } from "./components/ImagesModal";
import { ListingHeaderCarousel } from "./components/ListingHeaderCourousel.tsx";
import { ListingImagesDesktop } from "./components/ListingImageDesktop";
import { ListingInfo } from "./components/ListingInfos";

type Props = {
  params: { id: string };
};

export default async function ListingPage({ params }: Props) {
  const { id } = await params;
  const listing: ListingSingle | null = await getListingById(id);
  const categories = await getCategories();

  if (!listing) return <div>Annonce introuvable</div>;

  const breadcrumbItems = [
    { label: "Accueil", href: "/" },
    {
      label: listing.category.name,
      href: `/search?category=${listing.category.slug}`,
    },
    {
      label: listing.subCategory.name,
      href: `/search?subcategory=${listing.subCategory.slug}`,
    },
    {
      label: listing.location.region,
      href: `/search?region=${listing.location.region}`,
    },
    {
      label: listing.location.department,
      href: `/search?department=${listing.location.department}`,
    },
    {
      label: listing.location.city,
      href: `/search?city=${listing.location.city}`,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4">
      {/* Top categories + carousel + breadcrumb (desktop only) */}
      <div className="hidden lg:block">
        <Categories categories={categories} />
        <CategoryCarousel categories={categories} />
        <BreadcrumbSingle items={breadcrumbItems} />
      </div>

      {/* Mobile view: single column */}
      <div className="flex flex-col gap-6 lg:hidden">
        <ListingHeaderCarousel images={listing.images} />
        <ImageModalMobile images={listing.images} />
        <SingleMap listing={listing} />
        <ListingInfo listing={listing} />
      </div>

      {/* Desktop view: two-column layout */}
      <div className="mt-6 hidden lg:grid lg:grid-cols-[6fr_2fr] lg:gap-8">
        {/* Left column: images + map */}
        <div className="flex flex-col gap-6">
          {/** Desktop only */}
          <div className="hidden lg:block">
            <ListingImagesDesktop images={listing.images} />
            <ImagesModal images={listing.images} />
          </div>
          <ListingHeaderCarousel images={listing.images} />
          <SingleMap listing={listing} />
        </div>

        {/* Right column: info / seller */}
        <div className="flex flex-col gap-6">
          <ListingInfo listing={listing} />
        </div>
      </div>
    </div>
  );
}
