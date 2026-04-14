"use client";

import { XIcon } from "lucide-react";

import { CustomSidebar } from "./CustomSidebar";
import HomeContent from "./sidebarContent/home-content/HomeContent";
import { useSidebarStore } from "@/store/useSidebarStore";


export function AppSidebar() {
  const { open, view, closeSidebar } = useSidebarStore();

  return (
    <CustomSidebar open={open} onClose={closeSidebar} side="left">
      <div className="flex h-screen flex-col">
        {/* Header */}
        <div className="flex h-20 items-center justify-between border-b p-4">
          <h2 className="font-poppins text-primary text-2xl font-semibold capitalize">
            Lokko
          </h2>
          <button onClick={closeSidebar} aria-label="Close sidebar">
            <XIcon size={24} />
          </button>
        </div>

        {/* Content */}

        <div className="flex-1 min-h-0 overflow-y-auto p-4">
          {view === "home" && <HomeContent />}
  
        </div>
      </div>
    </CustomSidebar>
  );
}
