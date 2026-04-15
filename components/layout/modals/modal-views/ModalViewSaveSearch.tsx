"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { saveUserSearch } from "@/actions/user-actions";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  savedSearchSchema,
  SaveSearchInput,
} from "@/validations/user-validation";

type Props = {
  query: Record<string, unknown>;
  close: () => void;
};

export default function ModalViewSaveSearch({ query, close }: Props) {
  const queryClient = useQueryClient();

  const form = useForm<SaveSearchInput>({
    resolver: zodResolver(savedSearchSchema),
    defaultValues: {
      title: "",
      query,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: SaveSearchInput) => {
        const res = await saveUserSearch(data);
        if (!res.success) throw new Error(res.error);
        return res.data;
    },
    onSuccess: () => {
      toast.success("Search saved!");
      queryClient.invalidateQueries({ queryKey: ["saved-searches"] });
      close();
      form.reset();
    },
    onError: (err: Error) => toast.error(err?.message ?? "Failed to save search"),
  });

  useEffect(() => {
    form.setValue("query", query, {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    });
  }, [query, form]);

  return (
    <>
      <DialogTitle className="sr-only">Sauvgardez votre recherche</DialogTitle>

      <form
        onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
        className="flex flex-col gap-4"
      >
        <h2 className="text-lg font-medium">Sauvgardez votre recherche</h2>

        <Input placeholder="Entrer un titre" {...form.register("title")} />

        {form.formState.errors.title && (
          <p className="text-destructive text-sm">
            {form.formState.errors.title.message}
          </p>
        )}

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "En cours..." : "Sauvgarder"}
        </Button>
      </form>
    </>
  );
}
