import { getListingById } from "@/actions/listing-actions";
import { BreadcrumbSingle } from "@/components/bread-crump/BreadCrumpSingle";

type Props = {
  params: { id: string };
};

export default async function ListingPage({ params }: Props) {
  const listing = await getListingById(params.id);

  if (!listing) {
    return <div>Annonce introuvable</div>;
  }

const breadcrumbItems = [
  { label: "Accueil", href: "/" },
  { label: listing.category.name, href: `/search?category=${listing.category.slug}` },
  { label: listing.subCategory.name, href: `/search?subcategory=${listing.subCategory.slug}` },
  { label: listing.location.region, href: `/search?region=${listing.location.region}` },
  { label: listing.location.department, href: `/search?department=${listing.location.department}` },
  { label: listing.location.city, href: `/search?city=${listing.location.city}` },
];


  return (
    <>
      <BreadcrumbSingle items={breadcrumbItems} />

      <h1 className="text-2xl font-semibold">{listing.title}</h1>

      {/* le reste de la single */}
    </>
  );
}
