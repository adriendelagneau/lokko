import { cookies } from "next/headers";

import { SidebarProvider } from "@/components/ui/sidebar";

import { Footer } from "../../../components/layout/footer/footer";
import { HomeNavbar } from "../../../components/layout/navbar/home-navbar";
import { HomeSidebar } from "../../../components/layout/sidebar/hoeme-sidebar";

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Make sidebar open state persist through reload
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "false";

  return (


    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="w-full">
        <HomeNavbar />
        <div className="flex">
      
          <main className="mx-auto min-h-screen w-full max-w-screen-xl flex-1 pt-20">
            {children}
          </main>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  
  );
}
