"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";

import { Category } from "@/actions/category-actions";
import { listingSchema, ListingDraft } from "@/lib/schemas/listing.schema";

import { Wizard } from "../Wizard";

type ListingWizardFormProps = {
  categories: Category[];
};

const ListingWizardForm = ({ categories }: ListingWizardFormProps) => {
const methods = useForm<ListingDraft>({
  resolver: zodResolver(listingSchema),
  mode: "onSubmit",        // validation uniquement au submit / trigger
  reValidateMode: "onChange",
  defaultValues: {},
});

  const [step, setStep] = useState(0);

  const next = () => setStep((prev) => Math.min(prev + 1, 6));
  const prev = () => setStep((prev) => Math.max(0, prev - 1));

  return (
    <FormProvider {...methods}>
      <Wizard step={step} onNext={next} onPrev={prev}   categories={categories ?? []} />
    </FormProvider>
  );
};

export default ListingWizardForm;
