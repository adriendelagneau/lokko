"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModalStore } from "@/lib/store/useModalStore";

import { SignInView } from "./sign-in-view";

export const ModalContainer = () => {
  const { open, view, closeModal } = useModalStore();

  if (!open || !view) return null;

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="">
        {view === "login" && (
          <>
            <DialogHeader>
              <DialogTitle>Connexion</DialogTitle>
            </DialogHeader>

            <SignInView />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
