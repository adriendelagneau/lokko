import { Suspense } from "react";

import ListingsClient from "@/components/inifinte-scroll/ListingsClient";

import FilterSearch from "./FilterSearch";

const page = () => {
  return (
    <div>
      <Suspense fallback={<>...</>}>
        <FilterSearch />
        <ListingsClient />
      </Suspense>
    </div>
  );
};

export default page;
