"use client";

import { MapPin, Search, Euro, Filter, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSidebarStore } from "@/store/useSidebarStore";
import { useSearchState } from "@/hooks/use-search-state";

import SaveSearchButton from "./SaveSearchButton";

const FilterSearch = () => {
  const { openSidebar } = useSidebarStore();
  const { queryObj, clearSearch } = useSearchState();

  const hasFilters = Object.keys(queryObj).length > 0;

  return (
    <div className="mb-12 flex flex-col gap-4 px-2 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        {/* Desktop Filters */}
        <div className="hidden items-center gap-3 lg:flex">
          <Button size="sm" onClick={() => openSidebar("search")}>
            <MapPin className="mr-2 h-4 w-4" />
            Où 
          </Button>
          <Button size="sm" onClick={() => openSidebar("search")}>
            <Search className="mr-2 h-4 w-4" />
            Quoi 
          </Button>
          <Button size="sm" onClick={() => openSidebar("search")}>
            <Euro className="mr-2 h-4 w-4" />
            Combien 
          </Button>
        </div>

        {/* Mobile Filters */}
        <div className="lg:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openSidebar("search")}
            className="rounded-full"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filtres
          </Button>
        </div>

        {hasFilters && (
          <div className="flex items-center gap-2 border-l pl-3">
            <Button className="px-3 py-1 font-normal">
              {Object.keys(queryObj).length} filtre(s) actif(s)
            </Button>
            <Button variant="ghost" size="sm" onClick={clearSearch}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {hasFilters && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <SaveSearchButton query={queryObj} />
        </div>
      )}
    </div>
  );
};

export default FilterSearch;
