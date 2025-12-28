"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { Category, getCategories } from "@/actions/category-actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";



export const CategoryFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* ------------------ DATA ------------------ */
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
    staleTime: 1000 * 60 * 60, // 1h
  });

  /* ------------------ URL STATE ------------------ */
  const categorySlug = searchParams.get("category") ?? "";
  const subCategorySlug = searchParams.get("subCategory") ?? "";

  const selectedCategory = useMemo(
    () => categories?.find((c) => c.slug === categorySlug),
    [categories, categorySlug]
  );

  /* ------------------ URL UPDATE ------------------ */
  const updateUrl = (next: { category?: string; subCategory?: string }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (next.category) {
      params.set("category", next.category);
    } else {
      params.delete("category");
      params.delete("subCategory");
    }

    if (next.subCategory) {
      params.set("subCategory", next.subCategory);
    } else {
      params.delete("subCategory");
    }

    // reset pagination
    params.delete("page");

    router.push(`?${params.toString()}`, { scroll: false });
  };

  /* ------------------ LOADING ------------------ */
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    );
  }

  if (!categories?.length) return null;

  /* ------------------ UI ------------------ */
  return (
    <div className="space-y-4">
      {/* CATEGORY */}
      <Select
        value={categorySlug}
        onValueChange={(value) =>
          updateUrl({
            category: value || undefined,
          })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Catégorie" />
        </SelectTrigger>

        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.slug}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* SUBCATEGORY */}
      {selectedCategory && selectedCategory.subcategories.length > 0 && (
        <Select
          value={subCategorySlug}
          onValueChange={(value) =>
            updateUrl({
              category: selectedCategory.slug,
              subCategory: value || undefined,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Sous-catégorie" />
          </SelectTrigger>

          <SelectContent>
            {selectedCategory.subcategories.map((sub) => (
              <SelectItem key={sub.id} value={sub.slug}>
                {sub.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};
