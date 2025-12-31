import React, { Suspense } from "react";

import { getCategories } from "@/actions/category-actions";
import ListingWizardForm from "@/components/wizzard/listingWizardForm/ListingWizardForm";
const page = async () => {
  const categories = (await getCategories()) ?? []; // ✅ ensure array
  return (
    <div>
      <Suspense fallback={<>...</>}>
        <ListingWizardForm categories={categories} />
      </Suspense>
    </div>
  );
};

export default page;
