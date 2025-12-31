"use client";

import {
  BellRingIcon,
  HeartIcon,
  MenuIcon,
  MessageCircleIcon,
  SquarePlusIcon,
  UserRoundIcon,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useModalStore } from "@/lib/store/useModalStore";
import { useSidebarStore } from "@/lib/store/useSidebarStore";

import { NavSearchbar } from "./NavSearchbar";

export const HomeNavbar = () => {
  const { openModal } = useModalStore();
  const { openSidebar } = useSidebarStore();
  return (
    <div className="bg-background flex-row-center fixed top-0 left-0 z-30 h-10 w-full items-center border-b px-4 py-10 shadow-sm lg:h-16 lg:px-8">
      <div className="relative mx-auto flex h-full w-full max-w-6xl items-center lg:justify-between">
        {/* <SidebarTrigger className="lg:hidden" /> */}
        {/* Title */}
        <Link href={"/"}>
          <h1 className="text-primary font-poppins absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-semibold lg:static lg:top-0 lg:mx-0 lg:translate-x-0 lg:translate-y-0">
            Lokko
          </h1>
        </Link>

        <button onClick={() => openSidebar("home")}>
          <MenuIcon size={24} className="lg:hidden" />
        </button>

        {/* Create Listing */}
        <Link href={"/create-listing"}>
          <Button className="hidden lg:flex" size={"lg"}>
            <SquarePlusIcon />
            Creer une annonce
          </Button>
        </Link>

        {/* Search Bar */}
        <div className="relative hidden items-center lg:flex">
          <NavSearchbar />
        </div>

        {/* Icons */}
        <div className="hidden text-sm lg:flex lg:gap-5">
          <Link href={"/user/search"}>
            <div className="hover:text-primary flex cursor-pointer flex-col items-center justify-center transition-colors">
              <BellRingIcon size={20} />
              <p>Recherches</p>
            </div>
          </Link>
          <Link href={"/user/bookmark"}>
            <div className="hover:text-primary flex cursor-pointer flex-col items-center justify-center transition-colors">
              <HeartIcon size={20} />
              <p>Favoris</p>
            </div>
          </Link>
          <Link href={"/user/conversation"}>
            <div className="hover:text-primary relative flex cursor-pointer flex-col items-center justify-center transition-colors">
              <MessageCircleIcon size={20} />
              <p>Messages</p>
              <div className="bg-primary absolute -top-1 right-5 h-3 w-3 rounded-full"></div>
            </div>
          </Link>
          {/* <div className="hover:text-primary flex cursor-pointer flex-col items-center justify-center transition-colors">
            <UserIcon size={20} />
            <p>User</p>
          </div> */}
          {/* <AuthButton /> */}

          <button
            onClick={() => openModal("login")}
            className="hover:text-primary flex cursor-pointer flex-col items-center justify-center transition-colors"
          >
            <UserRoundIcon size={20} />
            <p>connexion</p>
          </button>
        </div>
      </div>
    </div>
  );
};
