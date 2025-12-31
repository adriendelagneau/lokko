// lib/store/useModalStore.ts
"use client";

import { create } from "zustand";

export type ModalView = "login" | "contact-seller";

export type ModalDataMap = {
  login: {
    redirectTo?: string;
  };
  "contact-seller": {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    listingId: string;
  };
};

type ModalState = {
  open: boolean;
  view: ModalView | null;
  data: ModalDataMap[ModalView] | null;

  openModal: <T extends ModalView>(
    view: T,
    data?: ModalDataMap[T]
  ) => void;

  closeModal: () => void;
};

export const useModalStore = create<ModalState>((set) => ({
  open: false,
  view: null,
  data: null,

  openModal: (view, data) =>
    set({
      open: true,
      view,
      data: data ?? null,
    }),

  closeModal: () =>
    set({
      open: false,
      view: null,
      data: null,
    }),
}));
