import { create } from "zustand";

interface ModalOptions {
  title?: string;             // Optional title for modal header
  size?: "sm" | "md" | "lg";  // Optional modal size
}

interface ModalState {
  isOpen: boolean;
  content: React.ReactNode | null;
  options?: ModalOptions;
  open: (content: React.ReactNode, options?: ModalOptions) => void;
  close: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  content: null,
  options: undefined,
  open: (content, options) => set({ isOpen: true, content, options }),
  close: () => set({ isOpen: false, content: null, options: undefined }),
}));
