// stores/sidebar-store.ts
import { create } from "zustand";

export type SidebarView = null | "home" | "search";

type SidebarState = {
  open: boolean;
  view: SidebarView;
  openSidebar: (view: SidebarView) => void;
  closeSidebar: () => void;
  toggleSidebar: (view: SidebarView) => void;
};

export const useSidebarStore = create<SidebarState>((set) => ({
  open: false,
  view: null,

  openSidebar: (view) => set({ open: true, view }),

  closeSidebar: () => set({ open: false, view: null }),

  toggleSidebar: (view) =>
    set((state) => ({
      open: !state.open || state.view !== view ? true : false,
      view: !state.open || state.view !== view ? view : null,
    })),
}));
