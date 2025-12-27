import ListingsClient from "@/components/inifinte-scroll/ListingsClient";

import FilterSearch from "./FilterSearch";

const page = () => {
  return (
    <div>
      <FilterSearch />
      <ListingsClient />
    </div>
  );
};

export default page;
