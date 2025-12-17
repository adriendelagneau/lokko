import { create } from "zustand";

import { stepSchemas, ListingDraft } from "../schemas/listing.schema";

type WizardState = {
  step: number;
  data: Partial<ListingDraft>;
  errors: Partial<Record<keyof ListingDraft, string[]>>;
  next: () => boolean;
  prev: () => void;
  update: (values: Partial<ListingDraft>) => void;
};

export const useListingWizard = create<WizardState>((set, get) => ({
  step: 0,
  data: {},
  errors: {},

  update: (values) =>
    set((state) => ({
      data: { ...state.data, ...values },
    })),

  next: () => {
    const { step, data } = get();
    const schema = stepSchemas[step];
    if (!schema) return false;

    const result = schema.safeParse(data);

    if (!result.success) {
      set({
        errors: result.error.flatten().fieldErrors as Partial<
          Record<keyof ListingDraft, string[]>
        >,
      });
      return false;
    }

    set((state) => ({
      step: Math.min(state.step + 1, stepSchemas.length - 1),
      errors: {},
    }));

    return true;
  },

  prev: () =>
    set((state) => ({
      step: Math.max(0, state.step - 1),
      errors: {},
    })),
}));
