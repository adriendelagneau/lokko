"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { useSidebarStore } from "@/lib/store/useSidebarStore";

const FilterSearch = () => {
  const { openSidebar } = useSidebarStore();
  return (
    <div className="my-12 flex gap-4 font-medium text-xl">
      <Button onClick={() => openSidebar("search")}>Ou ?</Button>
      <Button onClick={() => openSidebar("search")}>Quoi ?</Button>
      <Button onClick={() => openSidebar("search")}>Combien ?</Button>
    </div>
  );
};

export default FilterSearch;
