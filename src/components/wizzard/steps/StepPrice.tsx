"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useListingWizard } from "@/lib/store/listingWizard.store";

const UNITS = [
  { value: "UNIT", label: "Par unité" },
  { value: "KG", label: "Par kg" },
  { value: "L", label: "Par litre" },
] as const;

export default function StepPrice() {
  const { data, update, next, prev, errors } = useListingWizard();

  const price = data.price ?? {
    value: undefined,
    unit: "UNIT",
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Quel est le prix ?</h2>

      <div className="flex gap-3">
        <Input
          type="number"
          min="0"
          step="0.01"
          placeholder="Ex : 2.50"
          value={price.value ?? ""}
          onChange={(e) =>
            update({
              price: {
                ...price,
                value:
                  e.target.value === "" ? undefined : Number(e.target.value),
              },
            })
          }
        />

        <Select
          value={price.unit}
          onValueChange={(unit) =>
            update({
              price: {
                ...price,
                unit: unit as "UNIT" | "KG" | "L",
              },
            })
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {UNITS.map((u) => (
              <SelectItem key={u.value} value={u.value}>
                {u.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {errors.price && (
        <p className="text-destructive text-sm">{errors.price[0]}</p>
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
