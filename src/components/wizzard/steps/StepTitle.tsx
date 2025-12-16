"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useListingWizard } from "@/lib/store/listingWizard.store";

export default function StepTitle() {
  const { data, update, next, prev, errors, step } = useListingWizard();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        Quel est le titre de votre annonce ?
      </h2>

      <Input
        placeholder="Ex : Pommes bio du verger"
        value={data.title ?? ""}
        onChange={(e) => update({ title: e.target.value })}
        onKeyDown={(e) => {
          if (e.key === "Enter") next();
        }}
        autoFocus
      />

      {errors.title && (
        <p className="text-destructive text-sm">
          {errors.title[0]}
        </p>
      )}

      <div className="flex justify-between">
        <Button
          variant="ghost"
          onClick={prev}
          disabled={step === 0}
        >
          Retour
        </Button>

        <Button onClick={next}>
          Continuer
        </Button>
      </div>
    </div>
  );
}
