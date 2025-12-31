"use client";

import { SearchIcon, XIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { getListings } from "@/actions/listing-actions";

type Suggestion = {
  id: string;
  title: string;
};

export function NavSearchbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isSearchPage = pathname === "/search";

  /* ------------------ STATE ------------------ */
  const [value, setValue] = useState(searchParams.get("query") ?? "");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  /* ------------------ SYNC URL -> INPUT ------------------ */
  useEffect(() => {
    if (isSearchPage) {
      setValue(searchParams.get("query") ?? "");
    }
  }, [searchParams, isSearchPage]);

  /* ------------------ SEARCH PAGE MODE (debounce) ------------------ */
  useEffect(() => {
    if (!isSearchPage) return;

    const t = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (value.trim()) {
        params.set("query", value.trim());
      } else {
        params.delete("query");
      }

      params.delete("page");

      router.push(`/search?${params.toString()}`, {
        scroll: false,
      });
    }, 400);

    return () => clearTimeout(t);
  }, [value, isSearchPage, searchParams, router]);

  /* ------------------ SUGGESTIONS MODE ------------------ */
  useEffect(() => {
    if (isSearchPage) return;
    if (!open || value.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await getListings({
          query: value.trim(),
          page: 1,
          pageSize: 4,
        });

        setSuggestions(
          res.listings.filter((l) => l !== null).map((l) => ({
            id: l.id,
            title: l.title,
          }))
        );
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [value, open, isSearchPage]);

  /* ------------------ CLICK OUTSIDE ------------------ */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ------------------ ACTIONS ------------------ */
  const submitSearch = (q: string) => {
    if (!q.trim()) return;
    router.push(`/search?query=${encodeURIComponent(q.trim())}`);
    setOpen(false);
  };

  const resetSearch = () => {
    setValue("");
    setSuggestions([]);
    setOpen(false);

    if (isSearchPage) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("query");
      params.delete("page");

      router.push(`/search?${params.toString()}`, {
        scroll: false,
      });
    }
  };

  /* ------------------ UI ------------------ */
  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-xl "
    >
      {/* Search icon */}
      <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />

      {/* Input */}
      <input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            submitSearch(value);
          }
        }}
        placeholder="Rechercher sur Lokko"
        className="bg-background focus:ring-primary h-11 w-full rounded-md border pr-10 pl-9 text-sm focus:ring-2 focus:outline-none"
      />

      {/* Reset button */}
      {value && (
        <button
          type="button"
          onClick={resetSearch}
          className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
        >
          <XIcon className="h-4 w-4" />
        </button>
      )}

      {/* ------------------ SUGGESTIONS ------------------ */}
      {!isSearchPage && open && (
        <div className="bg-background absolute z-50 mt-2 w-full rounded-md border shadow-lg">
          {loading ? (
            <div className="text-muted-foreground px-4 py-3 text-sm">
              Recherche…
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="divide-y">
              {suggestions.map((s) => (
                <li
                  key={s.id}
                  onMouseDown={() => submitSearch(s.title)}
                  className="hover:bg-muted cursor-pointer px-4 py-2 text-sm"
                >
                  {s.title}
                </li>
              ))}
            </ul>
          ) : value.trim().length >= 2 ? (
            <div className="text-muted-foreground px-4 py-3 text-sm">
              Aucun résultat
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
