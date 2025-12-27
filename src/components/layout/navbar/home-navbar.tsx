"use client";

import {
  BellRingIcon,
  HeartIcon,
  MenuIcon,
  MessageCircleIcon,
  SearchCheckIcon,
  SquarePlusIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useSidebarStore } from "@/lib/store/useSidebarStore";

import { AuthButton } from "./auth-button";

// import { ThemeToggleCircle } from "@/components/providers/ThemeToggleWrapper";

export const HomeNavbar = () => {
  const { openSidebar } = useSidebarStore();
  return (
    <div className="bg-background fixed top-0 left-0 z-50 h-10 w-full px-4 py-10">
      <div className="relative mx-auto flex h-full w-full max-w-6xl items-center lg:justify-between">
        {/* <SidebarTrigger className="lg:hidden" /> */}
        {/* Title */}
        <Link href={"/"}>
          <h1 className="text-primary font-poppins absolute left-1/2 -translate-x-1/2 text-3xl font-semibold lg:static lg:mx-0 lg:translate-x-0">
            Lokko
          </h1>
        </Link>


        <button onClick={() => openSidebar("home")}>Home</button>
        <button onClick={() => openSidebar("search")}>Search</button>
      
        {/* Create Listing */}
        <Link href={"/create-listing"}>
          <Button className="hidden lg:flex" size={"lg"}>
            <SquarePlusIcon />
            Creer une annonce
          </Button>
        </Link>

        {/* Search Bar */}
        <div className="relative hidden items-center lg:flex">
          <SearchCheckIcon className="text-muted-foreground absolute left-3 h-5 w-5" />
          <input
            type="search"
            placeholder="Rechercher sur Lokko"
            className="bg-background focus:ring-primary h-11 w-96 rounded-md border pr-4 pl-10 text-sm focus:ring-2 focus:outline-none"
          />
        </div>

        {/* Icons */}
        <div className="hidden text-sm lg:flex lg:gap-5">
          <div className="hover:text-primary flex cursor-pointer flex-col items-center justify-center transition-colors">
            <BellRingIcon size={20} />
            <p>Recherches</p>
          </div>
          <div className="hover:text-primary flex cursor-pointer flex-col items-center justify-center transition-colors">
            <HeartIcon size={20} />
            <p>Favoris</p>
          </div>
          <div className="hover:text-primary relative flex cursor-pointer flex-col items-center justify-center transition-colors">
            <MessageCircleIcon size={20} />
            <p>Messages</p>
            <div className="bg-primary absolute -top-1 right-5 h-3 w-3 rounded-full"></div>
          </div>
          {/* <div className="hover:text-primary flex cursor-pointer flex-col items-center justify-center transition-colors">
            <UserIcon size={20} />
            <p>User</p>
          </div> */}
          <AuthButton />
        </div>
      </div>
    </div>
  );
};
