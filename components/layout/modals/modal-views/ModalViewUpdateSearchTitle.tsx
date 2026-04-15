"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { renameSavedSearch } from "@/actions/user-actions";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  UpdateTitleForm,
  updateTitleSchema,
} from "@/validations/user-validation";

type Props = {
  searchId: string;
  currentTitle: string;
  close: () => void;
};

export default function ModalViewUpdateSearchTitle({
  searchId,
  currentTitle,
  close,
}: Props) {
  const queryClient = useQueryClient();

  const form = useForm<UpdateTitleForm>({
    resolver: zodResolver(updateTitleSchema),
    defaultValues: { title: currentTitle },
  });

  const mutation = useMutation({
    mutationFn: async (data: UpdateTitleForm) => {
      const res = await renameSavedSearch(searchId, data.title);
      if (!res.success) throw new Error(res.error);
      return res;
    },
    onSuccess: () => {
      toast.success("Title updated!");
      queryClient.invalidateQueries({ queryKey: ["saved-searches"] });
      form.reset();
      close();
    },
    onError: () => toast.error("Failed to update title"),
  });

return (
  <>
    <DialogTitle className="sr-only">
      Modifier le titre
    </DialogTitle>

    <form
      className="flex flex-col gap-4"
      onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
    >
      <h2 className="text-lg font-medium">
        Modifier le titre de la recherche
      </h2>

      <Input
        placeholder="Saisissez un titre"
        {...form.register("title")}
        autoFocus
      />

      {form.formState.errors.title && (
        <p className="text-destructive text-sm">
          {form.formState.errors.title.message}
        </p>
      )}

      <Button
        type="submit"
        disabled={mutation.isPending || !form.formState.isValid}
      >
        {mutation.isPending ? "Enregistrement..." : "Mettre à jour"}
      </Button>
    </form>
  </>
);

}
