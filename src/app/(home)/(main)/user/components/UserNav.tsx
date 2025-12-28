"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Infos", href: "/user/infos" },
  { label: "Mes annonces", href: "/user/listings" },
  { label: "Favoris", href: "/user/bookmark" },
  { label: "Conversations", href: "/user/conversation" },
  { label: "Recherches sauvegardées", href: "/user/search" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className=" p-4">
      <h2 className="my-8 text-xl font-semibold">Mon compte</h2>
      <nav className="flex  gap-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-primary text-background"
                )}
              >
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
