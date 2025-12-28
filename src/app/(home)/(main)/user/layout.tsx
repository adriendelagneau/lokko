import { SidebarNav } from "./components/UserNav";

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Make sidebar open state persist through reload

  return (
    <>
      <SidebarNav />
      {children}
    </>
  );
}
