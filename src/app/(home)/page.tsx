import { getCategories } from "@/actions/category-actions";
import { CategoryCarousel } from "@/components/carousel/category-carousel";
import Categories from "@/components/categories/Categories";


export default async function Home() {

  const categories = await getCategories();


  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl gap-4">
    
      {/* <Categories categories={categories} /> */}
      {/* <CategoryCarousel categories={categories} /> */}
    </div>
  );
}
