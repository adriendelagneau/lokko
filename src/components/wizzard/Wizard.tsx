"use client";

import { Category } from "@/actions/category-actions";
import { useListingWizard } from "@/lib/store/listingWizard.store";

import { WizardProgress } from "./progressBar";
import StepCategory from "./steps/StepCategory";
import StepContact from "./steps/StepContact";
import StepDescription from "./steps/StepDescription";
import StepImages from "./steps/StepImages";
import StepLocation from "./steps/StepLocation";
import StepPrice from "./steps/StepPrice";
import StepTitle from "./steps/StepTitle";

const steps = [
  StepTitle,
  StepCategory, 
  StepImages,
  StepLocation,
  StepPrice,
  StepContact,
  StepDescription,
];

type WizardProps = {
  categories: Category[];
};


export const Wizard = ({ categories }: WizardProps) => {
  const step = useListingWizard((s) => s.step);
  const Step = steps[step];

  return (
    <div className="mx-auto max-w-xl p-6">
      <WizardProgress step={step} total={steps.length} />
      <Step categories={categories} />
    </div>
  );
};
