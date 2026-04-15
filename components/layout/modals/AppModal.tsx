"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useModalStore } from "@/store/useModalStore";
import { SignInView } from "./modal-views/auth/sign-in-view";
import ModalViewSaveSearch from "./modal-views/ModalViewSaveSearch";
import ModalViewUpdateSearchTitle from "./modal-views/ModalViewUpdateSearchTitle";
import ModalViewConfirmDeleteSearch from "./modal-views/ModalViewConfirmDeleteSearch";

export function AppModal() {
  const { open, view, closeModal, openModal, payload } = useModalStore();
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
        
        {view === "save-search" && payload && "query" in payload && (
          <ModalViewSaveSearch
            query={payload.query as Record<string, unknown>}
            close={closeModal}
          />
        )}

        {view === "update-search-title" &&
          payload &&
          "searchId" in payload &&
          "currentTitle" in payload && (
            <ModalViewUpdateSearchTitle
              searchId={payload.searchId}
              currentTitle={payload.currentTitle}
              close={closeModal}
            />
          )}

        {view === "confirm-delete-search" &&
          payload &&
          "searchId" in payload && (
            <ModalViewConfirmDeleteSearch
              searchId={payload.searchId}
              close={closeModal}
            />
          )}

      </DialogContent>
    </Dialog>
  );
}
