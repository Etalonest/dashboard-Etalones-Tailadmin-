// "use client";
// import React, { useState, ReactNode } from "react";
// import Sidebar from "@/src/components/Sidebar";
// import Header from "@/src/components/Header";

// export default function DefaultLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <>
//       {/* <!-- ===== Page Wrapper Start ===== --> */}
//       <div className="flex">
//         {/* <!-- ===== Sidebar Start ===== --> */}
//         <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
//         {/* <!-- ===== Sidebar End ===== --> */}

//         {/* <!-- ===== Content Area Start ===== --> */}
//         <div className="relative flex flex-1 flex-col lg:ml-72.5">
//           {/* <!-- ===== Header Start ===== --> */}
//           <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
//           {/* <!-- ===== Header End ===== --> */}

//           {/* <!-- ===== Main Content Start ===== --> */}
//           <main>
//             <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
//               {children}
//             </div>
//           </main>
//           {/* <!-- ===== Main Content End ===== --> */}
//         </div>
//         {/* <!-- ===== Content Area End ===== --> */}
//       </div>

//       {/* <!-- ===== Page Wrapper End ===== --> */}
//     </>
//   );
// }
"use client";

import React, { useState } from "react";
import Sidebar from "@/src/components/Sidebar";
import Header from "@/src/components/Header";
import ClickOutside from "@/src/components/ClickOutside"; // Для закрытия сайдбара при клике вне
import { Menu } from "lucide-react";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Функция для переключения состояния сайдбара
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <div className="flex">
        {/* Сайдбар */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Контент */}
        <div className="relative flex flex-1 flex-col">
          {/* Добавим кнопку для открытия/закрытия сайдбара */}
          <button
            onClick={toggleSidebar}
            className="fixed top-15 left-5 z-9999 p-2 bg-black text-white rounded-full opacity-25 transition-opacity duration-300 hover:opacity-100 focus:opacity-100 dark:bg-white dark:text-black dark:hover:opacity-100 dark:focus:opacity-100"
            aria-label="Toggle Sidebar"
          >
            <Menu />
          </button>

          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {/* Используем ClickOutside для закрытия сайдбара при клике вне его */}
              <ClickOutside onClick={() => setSidebarOpen(false)}>
                {children}
              </ClickOutside>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
