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
import { ListingDraft } from "@/validations/listing-schemas";

type CategoryType = {
  id: string;
  name: string;
  subcategories: {
    id: string;
    name: string;
    products?: { id: string; name: string }[];
  }[];
  products?: { id: string; name: string }[];
};

type StepCategoryProps = {
  categories: CategoryType[];
  onNext: () => void;
  onPrev: () => void;
};

const NONE_VALUE = "__none__";

export default function StepCategory({
  categories,
  onNext,
  onPrev,
}: StepCategoryProps) {
  const { watch, setValue, trigger, clearErrors } =
    useFormContext<ListingDraft>();

  const categoryId = watch("categoryId") ?? "";
  const subCategoryId = watch("subCategoryId") ?? "";
  const productId = watch("productId") ?? "";

  const isStepValid = !!categoryId;

  const selectedCategory = categories.find((c) => c.id === categoryId);
  const selectedSubCategory = selectedCategory?.subcategories.find(
    (s) => s.id === subCategoryId,
  );

  const products =
    selectedSubCategory?.products ?? selectedCategory?.products ?? [];

  const handleNext = async () => {
    const valid = await trigger(["categoryId", "subCategoryId", "productId"], {
      shouldFocus: true,
    });
    if (!valid) return;

    if (valid) onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Choisissez une catégorie</h2>

      {/* ================= CATEGORY ================= */}
      <Select
        value={categoryId}
        onValueChange={(value) => {
          if (value === NONE_VALUE) {
            setValue("categoryId", "", { shouldDirty: true });
            setValue("subCategoryId", "", { shouldDirty: true });
            setValue("productId", "", { shouldDirty: true });
            return;
          }

          setValue("categoryId", value, { shouldDirty: true });
          setValue("subCategoryId", "", { shouldDirty: true });
          setValue("productId", "", { shouldDirty: true });
          clearErrors();
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner une catégorie" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NONE_VALUE}>Autre</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* ================= SUBCATEGORY ================= */}
      <Select
        value={subCategoryId}
        disabled={!selectedCategory}
        onValueChange={(value) => {
          if (value === NONE_VALUE) {
            setValue("subCategoryId", "", { shouldDirty: true });
            setValue("productId", "", { shouldDirty: true });
            return;
          }

          setValue("subCategoryId", value, { shouldDirty: true });
          setValue("productId", "", { shouldDirty: true });
          clearErrors();
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner une sous-catégorie" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NONE_VALUE}>Aucune</SelectItem>
          {selectedCategory?.subcategories.map((sub) => (
            <SelectItem key={sub.id} value={sub.id}>
              {sub.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* ================= PRODUCT ================= */}
      <Select
        value={productId}
        disabled={products.length === 0}
        onValueChange={(value) => {
          if (value === NONE_VALUE) {
            setValue("productId", "", { shouldDirty: true });
            return;
          }

          setValue("productId", value, { shouldDirty: true });
          clearErrors();
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner un produit (optionnel)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NONE_VALUE}>Aucun</SelectItem>
          {products.map((prod) => (
            <SelectItem key={prod.id} value={prod.id}>
              {prod.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onPrev}>
          Retour
        </Button>
        <Button onClick={handleNext} disabled={!isStepValid}>
          Continuer
        </Button>
      </div>
    </div>
  );
}
