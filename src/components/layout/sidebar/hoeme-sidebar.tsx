"use client";

import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarTrigger,
} from "@/components/ui/sidebar";



import { MainSection } from "./main-section";

export const HomeSidebar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const sidebarTriggerRef = React.useRef<HTMLButtonElement>(null);
  const router = useRouter();

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      sidebarTriggerRef.current?.click(); // close sidebar
    }
  };

  return (
    <Sidebar className="z-40 border-none" collapsible="offcanvas">
      <SidebarContent className="bg-background flex h-full flex-col">
        {/* Header */}
        <div className="mt-3 flex items-center gap-2 p-2">
          <SidebarTrigger ref={sidebarTriggerRef} />
          <div className="font-poppins text-2xl text-primary font-semibold transition-all">
           Lokko
          </div>
        </div>

        {/* 🔍 Search */}
        <div className="mt-6 mb-3 ml-3 flex items-center gap-1">
          <SearchIcon size={20} />
          <Input
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchSubmit}
            className="mx-2 my-2 w-[251px]"
          />
        </div>
        <Separator />

        {/* Static Sections */}
        <div className="flex-shrink-0 font-medium">
          <MainSection
            closeSidebar={() => {
              sidebarTriggerRef.current?.click();
            }}
          />
        </div>
        <Separator />

        {/* Scrollable Category Section */}
        <div className="scrollbar scrollbar-none flex-1 overflow-y-auto">

        </div>
      </SidebarContent>
    </Sidebar>
  );
};
