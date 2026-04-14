"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useModalStore } from "@/store/useModalStore";
import { SignInView } from "./modal-views/auth/sign-in-view";

export function AppModal() {
  const { open, view, closeModal, openModal } = useModalStore();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("login") === "true") {
      openModal("login");
    }
  }, [searchParams, openModal]);

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="">
        <DialogHeader className="sr-only">
          <DialogTitle>Modal Window</DialogTitle>
          <DialogDescription>
            This is a modal window for {view}
          </DialogDescription>
        </DialogHeader>
        {view === "login" && <SignInView />}
    
      </DialogContent>
    </Dialog>
  );
}
