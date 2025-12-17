"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useListingWizard } from "@/lib/store/listingWizard.store";

export default function StepDescription() {
  const { data, update, next, prev, errors } = useListingWizard();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Décrivez votre annonce</h2>
      <p className="text-sm text-muted-foreground">
        Fournissez une description détaillée de ce que vous vendez.
      </p>

      <Textarea
        placeholder="Ex: Vend lot de pommes de terre de conservation, variété Bintje. Idéales pour frites, purées, et soupes..."
        value={data.description ?? ""}
        onChange={(e) => update({ description: e.target.value })}
        rows={6}
        className="resize-none"
      />

      {errors.description && (
        <p className="text-destructive text-sm">{errors.description[0]}</p>
      )}

      <div className="flex justify-between">
        <Button variant="ghost" onClick={prev}>
          Retour
        </Button>
        <Button onClick={next}>Continuer</Button>
      </div>
    </div>
  );
}