"use client";

import { SearchCheckIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const DEBOUNCE_MS = 400;

export function NavSearchbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isSearchPage = pathname === "/search";

  const queryFromUrl = searchParams.get("query") ?? "";
  const [value, setValue] = useState(queryFromUrl);
  const [open, setOpen] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  /** sync si l’url change ailleurs */
  useEffect(() => {
    setValue(queryFromUrl);
  }, [queryFromUrl]);

  /** ===============================
   *  CAS 1 — SEARCH PAGE
   *  =============================== */
  useEffect(() => {
    if (!isSearchPage) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (value.trim()) {
        params.set("query", value.trim());
      } else {
        params.delete("query");
      }

      params.delete("page");

      router.push(`/search?${params.toString()}`, { scroll: false });
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [value, isSearchPage]);

  /** ===============================
   *  CAS 2 — AUTRES PAGES
   *  =============================== */
  function submit() {
    if (!value.trim()) return;
    router.push(`/search?query=${encodeURIComponent(value.trim())}`);
    setOpen(false);
  }

  return (
    <div className="relative hidden lg:flex w-96">
      <SearchCheckIcon className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" />

      <input
        type="search"
        value={value}
        placeholder="Rechercher sur Lokko"
        className="bg-background focus:ring-primary h-11 w-full rounded-md border pr-4 pl-10 text-sm focus:ring-2 focus:outline-none"
        onChange={(e) => {
          setValue(e.target.value);
          if (!isSearchPage) setOpen(true);
        }}
        onFocus={() => {
          if (!isSearchPage) setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
      />

      {/* ===============================
          SUGGESTIONS
      =============================== */}
      {!isSearchPage && open && value && (
        <div className="absolute top-12 z-50 w-full rounded-md border bg-background shadow-lg">
          <ul className="divide-y">
            {/* mock – à brancher backend */}
            {[
              `${value} pas cher`,
              `${value} occasion`,
              `${value} bio`,
            ].map((s) => (
              <li
                key={s}
                onMouseDown={() => {
                  router.push(`/search?query=${encodeURIComponent(s)}`);
                  setOpen(false);
                }}
                className="cursor-pointer px-4 py-2 hover:bg-muted text-sm"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
