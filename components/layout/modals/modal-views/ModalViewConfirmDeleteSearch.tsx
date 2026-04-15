// components/modals/modal-views/ModalViewConfirmDeleteSearch.tsx
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteSavedSearch } from "@/actions/user-actions";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";

type Props = {
  searchId: string;
  close: () => void;
};

export default function ModalViewConfirmDeleteSearch({
  searchId,
  close,
}: Props) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
        const res = await deleteSavedSearch(searchId);
        if (!res.success) throw new Error(res.error);
        return res;
    },
    onSuccess: () => {
      toast.success("Saved search deleted!");
      queryClient.invalidateQueries({ queryKey: ["saved-searches"] });
      close();
    },
    onError: () => toast.error("Failed to delete search"),
  });

return (
  <>
    <DialogTitle className="sr-only">
      Confirmer la suppression
    </DialogTitle>

    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-medium">
        Êtes-vous sûr ?
      </h2>

      <p>
        Cette action est irréversible.
      </p>

      <div className="flex gap-2">
        <Button variant="destructive" onClick={() => mutation.mutate()}>
          Supprimer
        </Button>

        <Button onClick={close}>
          Annuler
        </Button>
      </div>
    </div>
  </>
);

}
