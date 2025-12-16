"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useListingWizard } from "@/lib/store/listingWizard.store";

type Category = {
  id: string;
  name: string;
  subcategories: {
    id: string;
    name: string;
  }[];
};

type StepCategoryProps = {
  categories: Category[];
};

export default function StepCategory({ categories }: StepCategoryProps) {
  const { data, update, next, prev, errors } = useListingWizard();

  const selectedCategory = categories.find((c) => c.id === data.categoryId);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Choisissez une catégorie</h2>

      {/* Category */}
      <Select
        value={data.categoryId}
        onValueChange={(value) => {
          update({
            categoryId: value,
            subCategoryId: undefined, // 🔥 reset subcat
          });
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner une catégorie" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {errors.categoryId && (
        <p className="text-destructive text-sm">{errors.categoryId[0]}</p>
      )}

      {/* SubCategory */}
      <Select
        value={data.subCategoryId}
        onValueChange={(value) => update({ subCategoryId: value })}
        disabled={!selectedCategory}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner une sous-catégorie" />
        </SelectTrigger>
        <SelectContent>
          {selectedCategory?.subcategories.map((sub) => (
            <SelectItem key={sub.id} value={sub.id}>
              {sub.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {errors.subCategoryId && (
        <p className="text-destructive text-sm">{errors.subCategoryId[0]}</p>
      )}

      <div className="flex justify-between">
        <Button variant="ghost" onClick={prev}>
          Retour
        </Button>
        <Button onClick={next}>Continuer</Button>
      </div>
    </div>
  );
}
