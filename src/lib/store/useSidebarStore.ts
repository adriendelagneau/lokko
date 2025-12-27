// stores/sidebar-store.ts
import { create } from "zustand";

export type SidebarView =
  | null
  | "home"
  | "search"
  | "settings"
  | "profile";

type SidebarState = {
  open: boolean;
  view: SidebarView;
  openSidebar: (view: SidebarView) => void;
  closeSidebar: () => void;
};

export const useSidebarStore = create<SidebarState>((set) => ({
  open: false,
  view: null,

  openSidebar: (view) =>
    set({ open: true, view }),

  closeSidebar: () =>
    set({ open: false, view: null }),
}));
