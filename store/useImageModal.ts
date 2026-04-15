import { create } from "zustand";

type ImageModalState = {
  isOpen: boolean;
  index: number;
  openAt: (index: number) => void;
  close: () => void;
  setIndex: (index: number) => void;
};

export const useImageModal = create<ImageModalState>((set) => ({
  isOpen: false,
  index: 0,
  openAt: (index) => set({ isOpen: true, index }),
  close: () => set({ isOpen: false }),
  setIndex: (index) => set({ index }),
}));
