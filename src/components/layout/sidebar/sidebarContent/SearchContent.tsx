import React from "react";

import { CategoryFilter } from "@/components/categories/CategoryFilter";
import GeoSearch from "@/components/geo/GeoSearch";

import { PriceRangeFilter } from "./PriceFilter";

const SearchContent = () => {
  return (
    <div>
      <GeoSearch />
      <PriceRangeFilter />
      <CategoryFilter />
    </div>
  );
};

export default SearchContent;
