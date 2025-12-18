"use client";

import { Category } from "@/actions/category-actions";

import { WizardProgress } from "./progressBar";
import StepCategory from "./steps/StepCategory";
import StepContact from "./steps/StepContact";
import StepDescription from "./steps/StepDescription";
import StepImages from "./steps/StepImages";
import StepLocation from "./steps/StepLocation";
import StepPrice from "./steps/StepPrice";
import StepTitle from "./steps/StepTitle";

type WizardProps = {
  step: number;
  onNext: () => void;
  onPrev: () => void;
  categories?: Category[];
};

const steps = [
  StepTitle,
  StepCategory,
  StepImages,
  StepLocation,
  StepPrice,
  StepContact,
  StepDescription,
];

export const Wizard = ({ step, onNext, onPrev, categories }: WizardProps) => {
  const StepComponent = steps[step];

  return (
    <div className="mx-auto max-w-xl p-6">
      <WizardProgress step={step} total={steps.length} />
      <StepComponent categories={categories} onNext={onNext} onPrev={onPrev} />
    </div>
  );
};
