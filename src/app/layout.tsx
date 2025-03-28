import { cookies } from "next/headers";
// import "jsvectormap/dist/jsvectormap.css";
// import "flatpickr/dist/flatpickr.min.css";
import "@/src/css/satoshi.css";
import "@/src/css/style.css";
// import React, { useEffect, useState } from "react";
import Loader from "@/src/components/common/Loader";
import { Provider } from "@/src/Provider";
import { ManagerProvider } from "../context/ManagerContext";
import { SearchProvider } from "../context/SearchContext";
import { NotificationProvider } from "../context/NotificationContext";
import Notifications from "../notification/Notifications";
import { CandidateProvider } from "../context/CandidateContext";
import { CandidatesProvider } from "../context/CandidatesContext";
import { SessionProvider } from "../context/SessionContext";
import { SidebarRProvider } from "../context/SidebarRContext";
import DefaultLayout from "../components/Layouts/DefaultLayout";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/SideBar/app-sidebar";
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const [loading, setLoading] = useState<boolean>(true);
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"; // Get the sidebar state from cookies

  // const pathname = usePathname();

  // useEffect(() => {
  //   setTimeout(() => setLoading(false), 1000);
  // }, []);

  return (
    <html lang="ru">
      <body suppressHydrationWarning={true}>
      <SessionProvider>
      <SidebarRProvider>
            <SidebarProvider defaultOpen={true}>
            <AppSidebar variant="inset" />
      <NotificationProvider>
      <Notifications />
        <SearchProvider>
        <ManagerProvider>
        <DefaultLayout >
        <SidebarInset>
          {children}
        </SidebarInset>
        </DefaultLayout>
        </ManagerProvider>
        </SearchProvider>
        </NotificationProvider>
        </SidebarProvider>
        </SidebarRProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
