"use client";

import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ListingDraft } from "@/lib/schemas/listing.schema";

type CategoryType = {
  id: string;
  name: string;
  subcategories: { id: string; name: string }[];
};

type StepCategoryProps = {
  categories: CategoryType[];
  onNext: () => void;
  onPrev: () => void;
};

export default function StepCategory({
  categories,
  onNext,
  onPrev,
}: StepCategoryProps) {
  const { register, watch, setValue, trigger, formState, clearErrors } =
    useFormContext<ListingDraft>();

  const categoryId = watch("categoryId");
  const subCategoryId = watch("subCategoryId");

  const selectedCategory = categories.find((c) => c.id === categoryId);

  // Clear errors automatically when values become valid
  if (formState.errors.categoryId && categoryId) {
    clearErrors("categoryId");
  }
  if (formState.errors.subCategoryId && subCategoryId) {
    clearErrors("subCategoryId");
  }

  const handleNext = async () => {
    const valid = await trigger(["categoryId", "subCategoryId"]);
    if (valid) onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Choisissez une catégorie</h2>

      {/* Category */}
      <Select
        value={categoryId}
        onValueChange={(value) => {
          setValue("categoryId", value);
          setValue("subCategoryId", ""); // reset subcategory
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
      {formState.errors.categoryId && (
        <p className="text-destructive text-sm">
          {formState.errors.categoryId.message}
        </p>
      )}

      {/* SubCategory */}
      <Select
        value={subCategoryId}
        onValueChange={(value) => setValue("subCategoryId", value)}
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
      {formState.errors.subCategoryId && (
        <p className="text-destructive text-sm">
          {formState.errors.subCategoryId.message}
        </p>
      )}

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onPrev}>
          Retour
        </Button>
        <Button onClick={handleNext}>Continuer</Button>
      </div>
    </div>
  );
}
