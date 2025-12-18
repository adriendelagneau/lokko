"use client";

import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ListingDraft } from "@/lib/schemas/listing.schema";

const UNITS = [
  { value: "UNIT", label: "Par unité" },
  { value: "KG", label: "Par kg" },
  { value: "L", label: "Par litre" },
] as const;

type PriceUnit = (typeof UNITS)[number]["value"];

type StepPriceProps = {
  onNext: () => void;
  onPrev: () => void;
};

export default function StepPrice({ onNext, onPrev }: StepPriceProps) {
  const {
    watch,
    setValue,
    trigger,
    formState: { errors },
    clearErrors,
  } = useFormContext<ListingDraft>();

  const price = watch("price") ?? { value: 0, unit: "UNIT" as PriceUnit };

  // auto-clear errors
  if (errors.price && price.value > 0) {
    clearErrors("price");
  }

  const handleNext = async () => {
    const valid = await trigger("price");
    if (valid) onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Quel est le prix ?</h2>
      <p className="text-muted-foreground text-sm">
        Indiquez un prix et son unité.
      </p>

      <div className="flex gap-3">
        <Input
          type="number"
          min={0}
          step="0.01"
          placeholder="Ex : 2.50"
          value={price.value || ""}
          onChange={(e) =>
            setValue(
              "price",
              { ...price, value: Number(e.target.value) },
              { shouldValidate: true }
            )
          }
        />

        <Select
          value={price.unit}
          onValueChange={(unit) =>
            setValue(
              "price",
              { ...price, unit: unit as PriceUnit },
              { shouldValidate: true }
            )
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
        <p className="text-destructive text-sm">
          {errors.price?.message?.toString()}
        </p>
      )}

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onPrev}>
          Retour
        </Button>
        <Button onClick={handleNext} disabled={price.value <= 0}>
          Continuer
        </Button>
      </div>
    </div>
  );
}
