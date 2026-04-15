import { CategoryFilter } from "./CategoryFilter";
import GeoSearch from "./GeoSearch";
import { PriceRangeFilter } from "./PriceFilter";

const SearchContent = () => {
  return (
    <div className="w-full h-full max-h-[calc(100vh-80px)] overflow-y-auto overflow-visible space-y-6 pb-10  scrollbar scrollbar-none">
      <GeoSearch />
      <PriceRangeFilter />
      <CategoryFilter />
    </div>
  );
};

export default SearchContent;
