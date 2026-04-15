import { Suspense } from "react";

import ListingsClient from "@/app/(main)/search/components/ListingsSearchClient";
import FilterSearch from "./components/FilterSearch";

const SearchPage = () => {
  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl pt-24">
      <Suspense>
        <FilterSearch />
        <ListingsClient />
      </Suspense>
    </div>
  );
};

export default SearchPage;
