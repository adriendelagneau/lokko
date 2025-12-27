"use client";

import { useSidebarStore } from "@/lib/store/useSidebarStore";

import { CustomSidebar } from "./CustomSidebar";
import HomeContent from "./sidebarContent/HomeContent";
import SearchContent from "./sidebarContent/SearchContent";

export function AppSidebar() {
  const { open, view, closeSidebar } = useSidebarStore();

  return (
    <CustomSidebar open={open} onClose={closeSidebar} side="left">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="font-semibold capitalize">{view}</h2>
          <button onClick={closeSidebar}>✕</button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {view === "home" && <HomeContent />}
          {view === "search" && <SearchContent />}
        </div>
      </div>
    </CustomSidebar>
  );
}
