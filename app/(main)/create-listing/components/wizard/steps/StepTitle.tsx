"use client";

import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListingDraft } from "@/validations/listing-schemas";

type StepTitleProps = {
  onNext: () => void;
  onPrev: () => void;
};

export default function StepTitle({ onNext, onPrev }: StepTitleProps) {
  const {
    register,
    trigger,
    watch,
    formState: { errors },
  } = useFormContext<ListingDraft>();

  const titleValue = watch("title");
  const isStepValid = !!titleValue;
  const handleNext = async () => {
    const valid = await trigger("title");
    if (valid) onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg lg:text-xl font-semibold">
        Quel est le titre de votre annonce ?
      </h2>

      <Input
        placeholder="Ex : Pommes bio du verger"
        {...register("title")}
        onKeyDown={(e) => e.key === "Enter" && handleNext()}
        autoFocus
      />

      {errors.title && (
        <p className="text-destructive text-sm">{errors.title.message}</p>
      )}

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onPrev}>
          Retour
        </Button>
        <Button onClick={handleNext} disabled={!isStepValid}>
          Continuer
        </Button>
      </div>
    </div>
  );
}
