"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useFormContext } from "react-hook-form";

import { createListing } from "@/actions/listing-actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ListingDraft } from "@/lib/schemas/listing.schema";

type StepDescriptionProps = { onPrev: () => void };

export default function StepDescription({ onPrev }: StepDescriptionProps) {
  const { watch, setValue } = useFormContext<ListingDraft>();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const data = watch();

  const onSubmit = async () => {
    startTransition(async () => {
      const res = await createListing(data);
      if (res.success) router.push(`/listing/${res.listingId}`);
      else console.error(res.error);
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-6"
    >
      <h2 className="text-xl font-semibold">Décrivez votre annonce</h2>
      <Textarea
        placeholder="Décrivez votre annonce..."
        value={data.description}
        onChange={(e) =>
          setValue("description", e.target.value, { shouldValidate: true })
        }
        rows={6}
      />
      <div className="flex justify-between">
        <Button variant="ghost" onClick={onPrev}>
          Retour
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Publication..." : "Publier"}
        </Button>
      </div>
    </form>
  );
}
