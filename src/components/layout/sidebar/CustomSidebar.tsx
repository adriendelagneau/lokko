"use client";

// components/custom-sidebar.tsx
import { ReactNode, useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  side?: "left" | "right";
  width?: string;
  children: ReactNode;
};

export function CustomSidebar({
  open,
  onClose,
  side = "left",
  width = "w-80",
  children,
}: Props) {
  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity
        ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 ${side === "left" ? "left-0" : "right-0"}
        z-50 h-screen ${width} bg-background shadow-xl
        transition-transform duration-300 ease-out
        ${
          open
            ? "translate-x-0"
            : side === "left"
            ? "-translate-x-full"
            : "translate-x-full"
        }`}
      >
        {children}
      </aside>
    </>
  );
}
