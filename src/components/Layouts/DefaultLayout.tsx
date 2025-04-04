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

import React from "react";
import {  SidebarTrigger} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster"

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
      <><div className="relative flex flex-1 flex-col">
      {/* <Header /> */}
        <main>
        <SidebarTrigger />

          {children}
          <Toaster />
        </main>
    </div></>
  );
}
