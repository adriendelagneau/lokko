// lib/store/useModalStore.ts
"use client";

import { create } from "zustand";

import type { GetContactModalDataResult } from "@/actions/messages-actioons";

export type ModalView =
  | "contact-seller"
  | "login"
  | "confirm";

export type ModalDataMap = {
  "contact-seller": {
    listingId: string;
    data: GetContactModalDataResult;
  };
  "login": {
    redirectTo?: string;
  };
  "confirm": {
    title: string;
    description?: string;
    onConfirm: () => void;
  };
};

type ModalState = {
  open: boolean;
  view: ModalView | null;
  data: ModalDataMap[ModalView] | null;

  openModal: <T extends ModalView>(
    view: T,
    data: ModalDataMap[T]
  ) => void;

  closeModal: () => void;
};

export const useModalStore = create<ModalState>((set) => ({
  open: false,
  view: null,
  data: null,

  openModal: (view, data) =>
    set({ open: true, view, data }),

  closeModal: () =>
    set({ open: false, view: null, data: null }),
}));
