"use client";

import { Progress } from "@/components/ui/progress";

export function WizardProgress({ step, total }: { step: number; total: number }) {
  const value = ((step + 1) / total) * 100;

  return (
    <div className="mb-6">
      <Progress value={value} />
      <p className="mt-2 text-sm text-muted-foreground">
        Étape {step + 1} / {total}
      </p>
    </div>
  );
}
