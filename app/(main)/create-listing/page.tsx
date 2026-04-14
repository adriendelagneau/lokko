import { getCategories } from "@/actions/category-actions";
import ListingWizardForm from "./components/wizard/ListingWizardForm";


const page = async () => {
  const categories = (await getCategories()) ?? [];
  return (
    <div className="mt-28 min-h-screen">
      <ListingWizardForm categories={categories} />
    </div>
  );
};

export default page;
