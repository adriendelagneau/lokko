"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModalStore } from "@/lib/store/useModalStore";

export const ModalContainer = () => {
  const { isOpen, content, options, close } = useModalStore();

  if (!isOpen) return null;

  const sizeClass =
    options?.size === "sm"
      ? "max-w-sm"
      : options?.size === "lg"
        ? "max-w-3xl"
        : "max-w-md"; // default

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className={`relative ${sizeClass} w-full`}>
        {options?.title && (
          <DialogHeader>
            <DialogTitle>{options.title}</DialogTitle>
          </DialogHeader>
        )}

        {content}

        <Button
          variant="ghost"
          onClick={close}
          className="absolute top-3 right-3 rounded-full p-1 text-gray-500 hover:text-gray-700"
        >
          ✕
        </Button>
      </DialogContent>
    </Dialog>
  );
};
