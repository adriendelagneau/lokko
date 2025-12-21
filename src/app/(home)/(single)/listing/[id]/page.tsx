import { List } from "lucide-react";

import { getCategories } from "@/actions/category-actions";
import { getListingById } from "@/actions/listing-actions";
import { BreadcrumbSingle } from "@/components/bread-crump/BreadCrumpSingle";
import { CategoryCarousel } from "@/components/carousel/category-carousel";
import Categories from "@/components/categories/Categories";
import SingleMap from "@/components/map/SingleMap";

import {
  HeaderImageModal,
  ListingHeaderCarousel,
} from "./components/ListingHeaderCourousel.tsx";
import ListingImages from "./components/ListingImages";

type Props = {
  params: { id: string };
};

export default async function ListingPage({ params }: Props) {
  const listing = await getListingById(params.id);
  const categories = await getCategories();

  const images = listing.images.map((img) => ({
    url: img.url,
    altText: img.altText ?? undefined,
  }));

  if (!listing) {
    return <div>Annonce introuvable</div>;
  }

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
    <div className="mx-auto w-full max-w-5xl">
      <div className="hidden lg:inline-block">
        <Categories categories={categories} />
        <CategoryCarousel categories={categories} />
        <BreadcrumbSingle items={breadcrumbItems} />
      </div>

      <div className="mb-12">
        <ListingHeaderCarousel
          images={images}
  
        />
      </div>

      <div className="flex">
        <div className="mx-auto w-full max-w-3xl lg:mx-0">
          <SingleMap listing={listing} />
        </div>
      </div>
      {/* le reste de la single */}
    </div>
  );
}
