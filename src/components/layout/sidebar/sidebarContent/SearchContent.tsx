import React from "react";

import GeoSearch from "@/components/geo/GeoSearch";

import { PriceRangeFilter } from "./PriceFilter";

const SearchContent = () => {
  return (
    <div>
      <GeoSearch />
      <PriceRangeFilter />
    </div>
  );
};

export default SearchContent;
