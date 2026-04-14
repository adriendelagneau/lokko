"use client";

import { useRouter } from "next/navigation";
import { useTransition, useMemo } from "react";
import { useFormContext } from "react-hook-form";

import { createListing } from "@/actions/listing-actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ListingDraft } from "@/validations/listing-schemas";

type StepDescriptionProps = { onPrev: () => void };

export default function StepDescription({ onPrev }: StepDescriptionProps) {
  const {
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<ListingDraft>();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const descriptionValue = watch("description") || "";

  // Determine if the step is valid for enabling the button
  const isStepValid = useMemo(
    () => descriptionValue.trim().length >= 10,
    [descriptionValue],
  );

  const onSubmit = async () => {
    const valid = await trigger("description");
    if (!valid) return;

    startTransition(async () => {
      const res = await createListing(watch());
      if (res.success) router.push("/user/listings/");
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
      <h2 className="text-lg lg:text-xl font-semibold">
        Décrivez votre annonce
      </h2>
      <Textarea
        placeholder="Décrivez votre annonce..."
        value={descriptionValue}
        onChange={(e) =>
          setValue("description", e.target.value, { shouldValidate: true })
        }
        rows={6}
      />
      {errors.description && (
        <p className="text-destructive text-sm">{errors.description.message}</p>
      )}

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onPrev}>
          Retour
        </Button>
        <Button type="submit" disabled={!isStepValid || isPending}>
          {isPending ? "Publication..." : "Publier"}
        </Button>
      </div>
    </form>
  );
}
