import { create } from "zustand";

type ImageModalState = {
  isOpen: boolean;
  startIndex: number;
  open: (index?: number) => void;
  close: () => void;
};

export const useImageModal = create<ImageModalState>((set) => ({
  isOpen: false,
  startIndex: 0,
  open: (index = 0) => set({ isOpen: true, startIndex: index }),
  close: () => set({ isOpen: false }),
}));
