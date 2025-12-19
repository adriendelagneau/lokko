
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ListingDraft } from "@/lib/schemas/listing.schema";

type ListingFormState = {
  formData: Partial<ListingDraft>;
  setFormData: (data: Partial<ListingDraft>) => void;
  reset: () => void;
};

export const useListingFormStore = create<ListingFormState>()(
  persist(
    (set) => ({
      formData: {},
      setFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
      reset: () => set({ formData: {} }),
    }),
    {
      name: "listing-form-data",
      storage: createJSONStorage(() => localStorage), 
    }
  )
);
