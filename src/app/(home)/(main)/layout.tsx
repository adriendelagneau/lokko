import { AppSidebar } from "@/components/layout/sidebar/AppSidebar";

import { Footer } from "../../../components/layout/footer/footer";
import { HomeNavbar } from "../../../components/layout/navbar/home-navbar";

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Make sidebar open state persist through reload

  return (
    <div className="w-full">
      <HomeNavbar />
      <div className="flex">
        <AppSidebar />
        <main className="mx-auto min-h-screen w-full max-w-screen-xl flex-1 pt-20">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
