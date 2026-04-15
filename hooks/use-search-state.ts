"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import { parseSearchParams } from "@/utils/parseSearchParams";

export function useSearchState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const queryObj = useMemo(
    () => parseSearchParams(searchParams),
    [searchParams]
  );

  const updateSearch = useCallback(
    (next: Record<string, string | number | null | undefined>, options?: { scroll?: boolean }) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(next).forEach(([key, value]) => {
        if (value === null || value === undefined) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      // Always reset page on filter change unless explicitly provided
      if (!("page" in next)) {
        params.delete("page");
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: options?.scroll ?? false });
    },
    [pathname, router, searchParams]
  );

  const clearSearch = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  return {
    queryObj,
    searchParams,
    updateSearch,
    clearSearch,
  };
}
