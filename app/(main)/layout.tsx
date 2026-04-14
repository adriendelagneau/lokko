import { Footer } from "@/components/layout/footer/footer";

import { HomeNavbar } from "@/components/layout/navbar/HomeNavbar";
import { AppModal } from "@/components/layout/modals/AppModal";
import { AppSidebar } from "@/components/layout/sidebar/AppSidebar";
import { Suspense } from "react";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Suspense fallback={null}>
        <AppModal />
        <AppSidebar />
      </Suspense>
      <HomeNavbar />
      <div>{children}</div>
      <Footer />
    </>
  );
}
