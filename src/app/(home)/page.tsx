import { getCategories } from "@/actions/category-actions";
import { getListings } from "@/actions/listing-actions";
import { CategoryCarousel } from "@/components/carousel/category-carousel";
import { ListingCarousel } from "@/components/carousel/main-carousel/ListingCarousel";
import Categories from "@/components/categories/Categories";


export default async function Home() {

  const categories = await getCategories();

  const listings = await getListings({});



  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl gap-4">
    
      <Categories categories={categories} />
      <CategoryCarousel categories={categories} />


      <ListingCarousel listings={listings.listings} />
    </div>
  );
}
