import { getCategories } from "@/actions/category-actions";
import { getListingById } from "@/actions/listing-actions";
import { BreadcrumbSingle } from "@/components/bread-crump/BreadCrumpSingle";
import { CategoryCarousel } from "@/components/carousel/category-carousel";
import Categories from "@/components/categories/Categories";
import SingleMap from "@/components/map/SingleMap";

type Props = {
  params: { id: string };
};

export default async function ListingPage({ params }: Props) {
  const listing = await getListingById(params.id);
  const categories = await getCategories();
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
      <Categories categories={categories} />
      <CategoryCarousel categories={categories} />
      <BreadcrumbSingle items={breadcrumbItems} />

      <h1 className="text-2xl font-semibold mb-92">{listing.title}</h1>

      {/* le reste de la single */}

      <SingleMap listing={listing} />
    </div>
  );
}
