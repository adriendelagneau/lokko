"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import {
  Category,
  getCategories,
  getProductsBySubCategory,
} from "@/actions/category-actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/lib/prisma/generated/prisma/client";
import { useSearchState } from "@/hooks/use-search-state";

export const CategoryFilter = () => {
  const { queryObj, updateSearch } = useSearchState();

  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
    staleTime: 1000 * 60 * 60, // 1h
  });

  const categorySlug = String(queryObj.category ?? "");
  const subCategorySlug = String(queryObj.subCategory ?? "");
  const productSlug = String(queryObj.product ?? "");

  const selectedCategory = useMemo(
    () => categories?.find((c) => c.slug === categorySlug),
    [categories, categorySlug],
  );

  const { data: products, isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ["products", subCategorySlug],
    queryFn: () => getProductsBySubCategory(subCategorySlug),
    enabled: !!subCategorySlug,
    staleTime: 1000 * 60 * 60,
  });

  const handleCategoryChange = (value: string) => {
    updateSearch({
      category: value || null,
      subCategory: null,
      product: null,
    });
  };

  const handleSubCategoryChange = (value: string) => {
    updateSearch({
      category: categorySlug,
      subCategory: value || null,
      product: null,
    });
  };

  const handleProductChange = (value: string) => {
    updateSearch({
      category: categorySlug,
      subCategory: subCategorySlug,
      product: value || null,
    });
  };

  if (isLoadingCategories) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    );
  }

  if (!categories?.length) return null;

  return (
    <div className="space-y-4">
      <Select value={categorySlug} onValueChange={handleCategoryChange}>
        <SelectTrigger>
          <SelectValue placeholder="Catégorie" />
        </SelectTrigger>
        <SelectContent className="z-[150]">
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.slug}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedCategory && selectedCategory.subcategories.length > 0 && (
        <Select value={subCategorySlug} onValueChange={handleSubCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sous-catégorie" />
          </SelectTrigger>
          <SelectContent className="z-[150]">
            {selectedCategory.subcategories.map((sub) => (
              <SelectItem key={sub.id} value={sub.slug}>
                {sub.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {subCategorySlug && (
        <>
          {isLoadingProducts && <Skeleton className="h-10 w-full rounded-md" />}
          {products && products.length > 0 && (
            <Select value={productSlug} onValueChange={handleProductChange}>
              <SelectTrigger>
                <SelectValue placeholder="Produit" />
              </SelectTrigger>
              <SelectContent className="z-[150]">
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.slug}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </>
      )}
    </div>
  );
};
