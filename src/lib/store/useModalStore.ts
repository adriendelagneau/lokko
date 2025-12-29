// lib/store/useModalStore.ts
import { create } from "zustand";

export type ModalView =
  | null
  | "contact-seller"
  | "login"
  | "confirm";

type ModalState = {
  open: boolean;
  view: ModalView;
  data?: unknown;

  openModal: (view: ModalView, data?: unknown) => void;
  closeModal: () => void;
};

export const useModalStore = create<ModalState>((set) => ({
  open: false,
  view: null,
  data: undefined,

  openModal: (view, data) =>
    set({ open: true, view, data }),

  closeModal: () =>
    set({ open: false, view: null, data: undefined }),
}));
