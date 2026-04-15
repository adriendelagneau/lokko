import { getCategories } from "@/actions/category-actions";
import { getListingById } from "@/actions/listing-actions";
import { getUser } from "@/lib/auth/auth-session";
import ListingResponsive from "./components/ListingResponsive";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ListingPage({ params }: Props) {
  const { id } = await params;

  const user = await getUser();
  const userId = user?.id || null;

  const listing = await getListingById(id);
  const categories = await getCategories();

  if (!listing) return <div>Annonce introuvable</div>;

  return (
    <ListingResponsive
      listing={listing}
      categories={categories}
      userId={userId}
    />
  );
}