import React from "react";

import { getCategories } from "@/actions/category-actions";
import ListingWizardForm from "@/components/wizzard/listingWizardForm/ListingWizardForm";
const page = async () => {
 const categories = (await getCategories()) ?? []; // ✅ ensure array
  return (
    <div>
      <ListingWizardForm categories={categories}/>
    </div>
  );
};

export default page;
