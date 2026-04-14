"use client";

import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

interface WizardProgressProps {
  step: number;
  total: number;
}

export function WizardProgress({ step, total }: WizardProgressProps) {
  // Array of step numbers [0, 1, 2, ...]
  const steps = Array.from({ length: total }, (_, i) => i);

  return (
    <div className="mb-10 w-full px-2">
      <div className="relative flex items-center justify-between">
        {/* Background Line */}
        <div className="bg-muted absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 rounded-full" />

        {/* Active Progress Line */}
        <div
          className="bg-primary absolute top-1/2 left-0 h-0.5 -translate-y-1/2 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${(step / (total - 1)) * 100}%` }}
        />

        {/* Step Circles */}
        {steps.map((s) => {
          const isCompleted = s < step;
          const isActive = s === step;

          return (
            <div key={s} className="relative z-10 flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-500",
                  isCompleted
                    ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-100"
                    : isActive
                      ? "bg-background border-primary ring-offset-background ring-primary/30 text-primary ring-4 scale-110"
                      : "bg-background border-muted text-muted-foreground scale-90",
                )}
              >
                {isCompleted ? (
                  <CheckIcon className="h-4 w-4 stroke-3" />
                ) : (
                  <span className="text-xs font-bold">{s + 1}</span>
                )}
              </div>
              
              {/* Optional Label below circle if needed */}
              {/* <span className={cn(
                "absolute -bottom-6 text-[10px] font-medium whitespace-nowrap transition-colors duration-300",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                Step {s + 1}
              </span> */}
            </div>
          );
        })}
      </div>
      
      {/* Current Step Title - keeping it simple for now */}
      <div className="mt-6 text-center">
        <p className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
          Étape {step + 1} sur {total}
        </p>
      </div>
    </div>
  );
}
