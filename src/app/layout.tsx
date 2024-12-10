"use client";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/src/css/satoshi.css";
import "@/src/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/src/components/common/Loader";
import { Provider } from "@/src/Provider";
import Manager from "../models/Manager";
import { ManagerProvider } from "../context/ManagerContext";
import { SearchProvider } from "../context/SearchContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  // const pathname = usePathname();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
      <Provider>
        <SearchProvider>
        <ManagerProvider>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          {loading ? <Loader /> : children}
        </div>
        </ManagerProvider>
        </SearchProvider>
        </Provider>
      </body>
    </html>
  );
}
