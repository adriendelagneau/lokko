import { getCategories } from "@/actions/category-actions";
import { getListings } from "@/actions/listing-actions";
import { CategoryCarousel } from "@/components/carousel/category-carousel";
import { ListingsSection } from "@/components/carousel/main-carousel/ListingSection";
import Categories from "@/components/categories/Categories";
import Pub from "@/components/Pub";

export default async function Home() {
  const categories = await getCategories();
  const fruits = await getListings({
    categorySlug: "boissons"
  });

  const bakery = await getListings({
    categorySlug: "boulangerie-cereales"
  });

    const eggs = await getListings({
    subCategorySlug: "oeufs"
  });


  return (
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
  );
}
