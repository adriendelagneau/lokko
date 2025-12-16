import React from "react";

import { getCategories } from "@/actions/category-actions";
import { Wizard } from "@/components/wizzard/Wizard";


const page = async () => {
  const categories = await getCategories();
  return (
    <div>
      <Wizard categories={categories} />
    </div>
  );
};

export default page;
