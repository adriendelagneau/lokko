import { cookies } from "next/headers";



export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Make sidebar open state persist through reload
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "false";

  return (
    <main className="mx-auto min-h-screen w-full max-w-screen-xl flex-1">
      {children}
    </main>
  );
}
