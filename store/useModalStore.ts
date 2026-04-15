// lib/store/useModalStore.ts
import { create } from "zustand";

type ContactSellerPayload = {
  listingId: string;
};

type SaveSearchPayload = {
  query: unknown;
};

type UpdateSearchTitlePayload = {
  searchId: string;
  currentTitle: string;
};

type ConfirmDeleteSearchPayload = {
  searchId: string;
};



type ModalPayloadMap = {
  "contact-seller": ContactSellerPayload;
  "save-search": SaveSearchPayload;
  "update-search-title": UpdateSearchTitlePayload;
  "confirm-delete-search": ConfirmDeleteSearchPayload;
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
