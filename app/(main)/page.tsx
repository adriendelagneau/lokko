import { getCategories } from "@/actions/category-actions";
import { getListings } from "@/actions/listing-actions";
import { ListingsSection } from "@/components/carousel/main-carousel/ListingSection";
import CategoriesSection from "@/components/categories/CategoeriesSection";
import Categories from "@/components/categories/Categories";
import { CategoryCarousel } from "@/components/categories/category-carousel";
import Pub from "@/components/Pub";
import { Suspense } from "react";

export default async function Home() {

  const categories = await getCategories();
 
  const fruitsEtLegumes = await getListings({
    pageSize: 12,
    category: "fruits-legumes",
  });

  const produitsAnimaux = await getListings({
    pageSize: 12,
    category: "produits-animaux",
  });

  return (
    <div className="min-h-screen w-full pt-28 px-4">
      <Categories categories={categories} />
      <Suspense>
        <CategoryCarousel categories={categories} />
      </Suspense>

      <Pub />

      <ListingsSection
        title="Fruits et légumes"
        listings={fruitsEtLegumes.listings}
        href="/search?category=fruits-legumes"
      />

      <ListingsSection
        title="Produits animaux"
        listings={produitsAnimaux.listings}
        href="/search?category=produits-animaux"
      />

      <div className="my-16 lg:my-24">
        <CategoriesSection />
      </div>

      <ListingsSection
        title="Nouveautés"
        listings={fruitsEtLegumes.listings}
        href="/search"
      />
    </div>
  );
}
