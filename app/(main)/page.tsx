import { getCategories } from "@/actions/category-actions";
import Categories from "@/components/categories/Categories";
import { CategoryCarousel } from "@/components/categories/category-carousel";
import { Suspense } from "react";

export default async function Home() {

  const categories = await getCategories();
 

  return (
    <div className="min-h-screen w-full pt-28 px-4">
      <Categories categories={categories} />
      <Suspense>
        <CategoryCarousel categories={categories} />
      </Suspense>
    </div>
  );
}
