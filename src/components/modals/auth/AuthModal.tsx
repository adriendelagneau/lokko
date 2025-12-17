"use client";

import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuthModal } from "@/lib/store/useAuthStore";

import { SignInView } from "./sign-in-view";

export const AuthModal = () => {
  const { isOpen, close } = useAuthModal();
  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? null : close())}>
      <DialogContent className="bg-card max-w-md">
        <DialogHeader>
          <DialogTitle className="mx-auto text-xl">
            Connexion ou Inscription
          </DialogTitle>
        </DialogHeader>

        <SignInView />

        <DialogFooter>
          <p className="text-muted-foreground mx-auto text-xs">
            En continuant, vous acceptez notre{" "}
            <Link href="/legal" className="cursor-pointer hover:underline">
              politique de confidentialité.
            </Link>
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
