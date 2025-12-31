import { Suspense } from "react";

import { getCategories } from "@/actions/category-actions";
import { getListings } from "@/actions/listing-actions";
import { CategoryCarousel } from "@/components/carousel/category-carousel";
import { ListingsSection } from "@/components/carousel/main-carousel/ListingSection";
import Categories from "@/components/categories/Categories";
import Pub from "@/components/Pub";

export default async function Home() {
  const categories = await getCategories();
  const fruits = await getListings({
    category: "fruits-legumes",
  });

  const bakery = await getListings({
    category: "jardin-plants",
  });

  const eggs = await getListings({
    subCategory: "oeufs",
  });

  return (
    <Suspense fallback={<>...</>}>
      <div className="mx-auto min-h-screen w-full max-w-7xl gap-4">
        <Categories categories={categories} />
        <CategoryCarousel categories={categories} />

        <Pub />
        <ListingsSection
          title="Boissons"
          listings={fruits.listings}
          href="/search?category=boissons"
        />
        <ListingsSection
          title="Boulangerie-cereales"
          listings={bakery.listings}
          href="/search?category=boulangerie-cereales"
        />
        <ListingsSection
          title="Oeufs"
          listings={eggs.listings}
          href="/search?subcategory=oeufs"
        />
      </div>
    </Suspense>
  );
}
