// lib/store/useModalStore.ts
import { create } from "zustand";


type ModalPayloadMap = {
  login: undefined;
};

export type ModalView = keyof ModalPayloadMap | null;

type ModalState = {
  open: boolean;
  view: ModalView;
  payload?: ModalPayloadMap[Exclude<ModalView, null>];

  openModal: <T extends Exclude<ModalView, null>>(
    view: T,
    ...payload: ModalPayloadMap[T] extends undefined ? [] : [ModalPayloadMap[T]]
  ) => void;

  closeModal: () => void;
};

export const useModalStore = create<ModalState>((set) => ({
  open: false,
  view: null,
  payload: undefined,

  openModal: (view, ...payload) =>
    set({
      open: true,
      view,
      payload: payload[0],
    }),

  closeModal: () =>
    set({
      open: false,
      view: null,
      payload: undefined,
    }),
}));
