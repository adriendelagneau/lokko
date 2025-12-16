"use client";

import {
  BookmarkIcon,
  FlameIcon,
  HomeIcon,
  PlaySquareIcon,
  User2Icon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Home",
    url: "/",
    icon: HomeIcon,
  },
  {
    title: "Subscription",
    url: "/subscriptions",
    icon: PlaySquareIcon,
    auth: true,
  },
  {
    title: "Trending",
    url: "/feed/trending",
    icon: FlameIcon,
  },
  {
    title: "Profile",
    url: "/user",
    icon: User2Icon,
    auth: true,
  },
  {
    title: "Bookmark",
    url: "/articles/bookmark",
    icon: BookmarkIcon,
    auth: true,
  },
];

export const MainSection = ({
  closeSidebar,
}: {
  closeSidebar?: () => void;
}) => {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item, i) => {
            const isActive = pathname === item.url;

            return (
              <SidebarMenuItem key={i}>
                <SidebarMenuButton
                  tooltip={item.title}
                  asChild
                  isActive={isActive}
                >
                  <Link href={item.url} onClick={() => closeSidebar?.()}>
                    <item.icon size={16} />
                    <span className="text-md">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

