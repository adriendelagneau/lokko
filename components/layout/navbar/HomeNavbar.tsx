"use client";

import {
  SearchIcon,
  HeartIcon,
  MenuIcon,
  MessageCircleIcon,
  SquarePlusIcon,
  UserRoundIcon,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { useModalStore } from "@/store/useModalStore";
import { useSidebarStore } from "@/store/useSidebarStore";

import { NavSearchbar } from "./NavSearchbar";
import { UserButton } from "./user-button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ModeToggle } from "./ModeToggle";


interface NavbarActionProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  hasNotification?: boolean;
}

export const HomeNavbar = () => {
  const router = useRouter();
  const { openModal } = useModalStore();
  const { toggleSidebar } = useSidebarStore();
  const { data: session } = authClient.useSession();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const unreadCount = {
    unreadListings: 1,
    unreadMessages: 2,
  }

  const handleProtectedNav = (path: string) => {
    if (!session?.user) {
      openModal("login");
      return;
    } else {
      router.push(path);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="bg-background fixed top-0 left-0 z-50 flex h-16 w-full items-center border-b px-4 shadow-sm lg:px-8">
      <div className="relative mx-auto flex h-full w-full max-w-6xl items-center lg:justify-between">
        {/* Mobile menu */}
        <button onClick={() => toggleSidebar("home")} className="lg:hidden">
          <MenuIcon size={24} />
        </button>

        {/* Logo */}
        <Link
          href="/"
          className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 gap-2 lg:static lg:translate-x-0 lg:translate-y-0"
        >
          <Image
            src="/logo.svg"
            alt="Lokko logo"
            width={32}
            height={32}
            className="h-8 w-auto"
          />
          <h1 className="text-primary font-poppins text-2xl font-semibold lg:text-3xl">
            Lokko
          </h1>
        </Link>

        {/* Create listing */}
        <Button
          size="lg"
          className="ml-8  hidden lg:flex"
          onClick={() => handleProtectedNav("/create-listing")}
        >
          <SquarePlusIcon />
          Créer une annonce
        </Button>

        {/* Search */}
        <div className="relative mx-6 hidden grow lg:flex">
          <Suspense fallback={null}>
            <NavSearchbar />
          </Suspense>
        </div>

        {/* Actions */}
        <div className="hidden gap-4 text-sm lg:flex items-center">

          <ModeToggle />
          <NavbarAction
            label="Favoris"
            icon={<HeartIcon size={20} />}
            onClick={() => handleProtectedNav("/user/bookmark")}
          />
          <NavbarAction
            label="Recherches"
            icon={<SearchIcon size={20} />}
            onClick={() => handleProtectedNav("/user/search")}
            hasNotification={
              !!unreadCount?.unreadListings && unreadCount.unreadListings > 0
            }
          />

          <NavbarAction
            label="Messages"
            icon={<MessageCircleIcon size={20} />}
            onClick={() => handleProtectedNav("/user/conversation")}
            hasNotification={
              !!unreadCount?.unreadMessages && unreadCount.unreadMessages > 0
            }
          />

          {session?.user ? (
            <UserButton />
          ) : (
            <NavbarAction
              label="Connexion"
              icon={<UserRoundIcon size={20} />}
              onClick={() => openModal("login")}
            />
          )}
        </div>
      </div>
      <SearchIcon
        size={20}
        className="ml-2 cursor-pointer lg:hidden"
        onClick={() => setIsSearchOpen(true)}
      />
      <div
        className={`bg-background absolute inset-x-0 top-0 z-50 flex h-full items-center px-4 transition-transform duration-300 ease-in-out lg:hidden ${isSearchOpen ? "translate-y-0" : "-translate-y-full"
          }`}
      >
        <div className="w-full">
          <Suspense fallback={null}>
            <NavSearchbar />
          </Suspense>
        </div>
        <button
          onClick={() => setIsSearchOpen(false)}
          className="ml-2"
          aria-label="Fermer la recherche"
        >
          <XIcon size={24} />
        </button>
      </div>
    </div>
  );
};

const NavbarAction = ({
  label,
  icon,
  onClick,
  hasNotification,
}: NavbarActionProps) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <div
        onClick={onClick}
        className="hover:text-primary relative flex cursor-pointer items-center justify-center transition-colors"
      >
        {icon}
        {hasNotification && (
          <span className="bg-primary absolute -top-1 -right-0.5 h-3 w-3 rounded-full" />
        )}
      </div>
    </TooltipTrigger>
    <TooltipContent>
      <p>{label}</p>
    </TooltipContent>
  </Tooltip>
);
