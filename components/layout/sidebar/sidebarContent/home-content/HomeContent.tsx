"use client";

import {
  BellRingIcon,
  HeartIcon,
  LogOutIcon,
  MessageCircleIcon,
  PlusIcon,
  User2Icon,
} from "lucide-react";
import Link from "next/link";


import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useModalStore } from "@/store/useModalStore";
import { useSidebarStore } from "@/store/useSidebarStore";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { ThemeSwitch } from "../../SidebarThemeToggle";


const HomeContent = () => {
  const router = useRouter();
  const { openModal } = useModalStore();
  const { closeSidebar } = useSidebarStore();
  const { data: session } = authClient.useSession();

  const handleConnectClick = () => {
    openModal("login");
    closeSidebar();
  };

  const handleSignout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          closeSidebar();
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  const handleProtectedNav = (path: string) => {
    if (!session?.user) {
      closeSidebar();
      openModal("login");
      return;
    } else {
      closeSidebar();

      router.push(path);
    }
  };
  return (
    <div>

      <Button
        className="my-2 w-full "
        onClick={() => handleProtectedNav("/create-listing")}
      >
        <PlusIcon className="mr-2 h-4 w-4" />
        Publier une annonce
      </Button>

      <Separator className="my-4" />
      <ul className="flex flex-col items-start gap-2">
        {session?.user ? (
          <li className="w-full">
            <Link href="/user/infos" onClick={closeSidebar}>
              <Button
                variant="ghost"
                className="w-full justify-start text-left"
              >
                <User2Icon className="mr-2 h-4 w-4" />
                Profil
              </Button>
            </Link>
          </li>
        ) : (
          <li className="w-full">
            <Button
              onClick={handleConnectClick}
              variant="ghost"
              className="w-full justify-start text-left"
            >
              <User2Icon className="mr-2 h-4 w-4" />
              Connexion / Inscription
            </Button>
          </li>
        )}

        <li className="w-full">
          <Button
            variant="ghost"
            className="w-full justify-start text-left"
            onClick={() => handleProtectedNav("/user/conversation")}
          >
            <MessageCircleIcon className="mr-2 h-4 w-4" />
            Messages
          </Button>
        </li>

        <li className="w-full">
          <Button
            variant="ghost"
            className="w-full justify-start text-left"
            onClick={() => handleProtectedNav("/user/bookmark")}
          >
            <HeartIcon className="mr-2 h-4 w-4" />
            Favoris
          </Button>
        </li>

        <li className="w-full">
          <Button
            variant="ghost"
            className="w-full justify-start text-left"
            onClick={() => handleProtectedNav("/user/search")}
          >
            <BellRingIcon className="mr-2 h-4 w-4" />
            Recherches
          </Button>
        </li>
      </ul>
      <Separator className="my-4" />
      {session?.user && (
        <>
          <Button
            variant="ghost"
            className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full justify-start text-left"
            onClick={handleSignout}
          >
            <LogOutIcon className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
          <Separator className="my-4" />
        </>
      )}
      <ThemeSwitch />
    </div>
  );
};

export default HomeContent;
