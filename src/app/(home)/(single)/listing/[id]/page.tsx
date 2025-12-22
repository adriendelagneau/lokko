import { getCategories } from "@/actions/category-actions";
import { getListingById, ListingSingle } from "@/actions/listing-actions";
import { BreadcrumbSingle } from "@/components/bread-crump/BreadCrumpSingle";
import { CategoryCarousel } from "@/components/carousel/category-carousel";
import Categories from "@/components/categories/Categories";
import SingleMap from "@/components/map/SingleMap";

import ImageModalMobile from "./components/ImageMobileModal";
import { ImagesModalDesktop } from "./components/ImagesModal";
import { ListingHeaderCarousel } from "./components/ListingHeaderCourousel.tsx";
import { ListingImagesDesktop } from "./components/ListingImageDesktop";
import { ListingInfos } from "./components/ListingInfos";
import { ListingUserInfo } from "./components/ListingUserInfos";
import { ListingDetails } from "./components/ListingDescription";

type Props = {
  params: { id: string };
};

export default async function ListingPage({ params }: Props) {
  const { id } = await params;
  const listing: ListingSingle | null = await getListingById(id);
  const categories = await getCategories();

  if (!listing) return <div>Annonce introuvable</div>;

  console.log(listing);

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
      {/* ================= DESKTOP TOP ================= */}
      <div className="hidden lg:block">
        <Categories categories={categories} />
        <BreadcrumbSingle items={breadcrumbItems} />
      </div>

      {/* ================= MOBILE ================= */}
      <div className="flex flex-col gap-6 lg:hidden">
        {/* Images */}
        <ListingHeaderCarousel images={listing.images} />
        <ImageModalMobile images={listing.images} />

        {/* Infos */}
        <ListingInfos
          title={listing.title}
          price={listing.price}
          unit={listing.priceUnit}
          date={listing.createdAt.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
          city={listing.location.city}
          likes={123}
        />


        {/* Details */}
        <ListingDetails description={listing.description} />

        {/* Map */}
        <SingleMap listing={listing} />

        {/* Seller */}
        <ListingUserInfo listing={listing} />
      </div>

      {/* ================= DESKTOP ================= */}
      <div className="mt-6 hidden gap-8 lg:grid lg:grid-cols-[6fr_2fr]">
        {/* LEFT */}
        <div className="flex flex-col gap-6">
          {/* Images */}
          <ListingImagesDesktop images={listing.images} />
          <ImagesModalDesktop images={listing.images} />

          {/* Infos */}
          <ListingInfos
            title={listing.title}
            price={listing.price}
            unit={listing.priceUnit}
            date={listing.createdAt.toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
            city={listing.location.city}
            likes={123}
          />

          {/* Details */}
          <ListingDetails description={listing.description} />

          {/* Map */}
          <SingleMap listing={listing} />
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-6">
          <ListingUserInfo listing={listing} />
        </div>
      </div>
    </div>
  );
}
