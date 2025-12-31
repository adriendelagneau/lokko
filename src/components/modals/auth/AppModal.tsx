// components/modals/AppModal.tsx
"use client";

import {
  Dialog,
  DialogContent,

} from "@/components/ui/dialog";
import { useModalStore } from "@/lib/store/useModalStore";

import { ContactSellerModal } from "./contact-seller-modal";

export function AppModal() {
  const { open, view, data, closeModal } = useModalStore();

  if (!view) return null;

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="max-w-lg">
              {view === "contact-seller" && data && "data" in data && (
          <ContactSellerModal data={data.data} />
        )}

        {view === "login" && <div>Login modal</div>}
      </DialogContent>
    </Dialog>
  );
}
