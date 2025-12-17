"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";

import { createListing } from "@/actions/listing-actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { listingSchema, ListingDraft } from "@/lib/schemas/listing.schema";
import { useListingWizard } from "@/lib/store/listingWizard.store";

export default function StepDescription() {
  const { data, update, prev } = useListingWizard();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ListingDraft>({
    resolver: zodResolver(listingSchema),
    defaultValues: data as ListingDraft,
    mode: "onTouched",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  // 🔁 sync textarea -> wizard store (optionnel mais safe)
  useEffect(() => {
    const sub = form.watch((values) => update(values));
    return () => sub.unsubscribe();
  }, [form, update]);

  const onSubmit = (values: ListingDraft) => {
    startTransition(async () => {
      const res = await createListing(values);

      if (!res.success) {
        console.error(res.error);
        return;
      }

      router.push(`/listing/${res.listingId}`);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-xl font-semibold">Décrivez votre annonce</h2>

      <Textarea
        {...register("description")}
        rows={6}
        placeholder="Décrivez votre annonce..."
      />

      {errors.description && (
        <p className="text-destructive text-sm">{errors.description.message}</p>
      )}

      <div className="flex justify-between">
        <Button type="button" variant="ghost" onClick={prev}>
          Retour
        </Button>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Publication..." : "Publier"}
        </Button>
      </div>
    </form>
  );
}
