// components/listing-images/useImageModal.ts
import { create } from "zustand";

type ImageModalState = {
  open: boolean;
  index: number;
  openAt: (index: number) => void;
  close: () => void;
};

export const useImageModal = create<ImageModalState>((set) => ({
  open: false,
  index: 0,
  openAt: (index) => set({ open: true, index }),
  close: () => set({ open: false }),
}));
