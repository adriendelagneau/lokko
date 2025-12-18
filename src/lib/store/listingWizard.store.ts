import { create } from "zustand";

type WizardState = {
  step: number;
  next: () => void;
  prev: () => void;
  setStep: (step: number) => void;
};

export const useListingWizard = create<WizardState>((set, get) => ({
  step: 0,
  next: () =>
    set((s) => ({
      step: Math.min(s.step + 1, 6), // total steps - 1
    })),
  prev: () =>
    set((s) => ({
      step: Math.max(0, s.step - 1),
    })),
  setStep: (step: number) => set({ step }),
}));
