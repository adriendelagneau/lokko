// useImagesModal.ts
import { create } from "zustand";

type ImageModalState = {
  open: boolean;
  index: number;
  openAt: (index: number) => void;
  close: () => void;
  setIndex: (index: number) => void;
};

export const useImageModal = create<ImageModalState>((set) => ({
  open: false,
  index: 0,
  openAt: (index) => set({ open: true, index }),
  close: () => set({ open: false }),
  setIndex: (index) => set({ index }),
}));
