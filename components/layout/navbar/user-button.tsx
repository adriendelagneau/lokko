"use client";

import { LogOutIcon, SettingsIcon, User2Icon } from "lucide-react";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { LogoutButton } from "./logout-button";

export const UserButton = () => {
  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <button
              className="hover:text-primary flex cursor-pointer items-center justify-center transition-colors"
              aria-label="Parametres"
            >
              <SettingsIcon size={20} />
            </button>
          </DropdownMenuTrigger>
        </TooltipTrigger>

        <TooltipContent>
          <p>Parametres</p>
        </TooltipContent>
      </Tooltip>

      <DropdownMenuContent className="w-40" align="end">
        <Link href={"/user/infos"} className="flex gap-x-2">
          <DropdownMenuItem className="w-full cursor-pointer">
            <User2Icon className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
        </Link>

        <LogoutButton>
          <DropdownMenuItem className="cursor-pointer">
            <LogOutIcon className="mr-2 h-4 w-4" />
            Deconnexion
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
