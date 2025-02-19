// "use client";

// import React from "react";
// import { usePathname } from "next/navigation";
// import Link from "next/link";
// import Image from "next/image";
// import SidebarItem from "@/src/components/Sidebar/SidebarItem";
// import ClickOutside from "@/src/components/ClickOutside";
// import useLocalStorage from "@/src/hooks/useLocalStorage";
// import { BookCheck, CalendarDays, ChartArea, Menu, Settings, Table, UserCircle } from "lucide-react";

// interface SidebarProps {
//   sidebarOpen: boolean;
//   setSidebarOpen: (arg: boolean) => void;
// }

// const menuGroups = [
//   {
//     name: "MENU",
//     menuItems: [
//       {
//         icon: (
//           <ChartArea/>
//         ),
//         label: "Информационная панель",
//         route: "#",
//         children: [{ label: "Графики", route: "/" }],
//       },
//       {
//         icon: (
//           <BookCheck/>
//         ),
//         label: "Результаты работы",
//         route: "/funnel",
//       },
//       {
//         icon: (
//           <CalendarDays/>

//         ),
//         label: "Календарь",
//         route: "/calendar",
//       },
//       {
//         icon: (
//          <UserCircle/>
//         ),
//         label: "Профиль",
//         route: "/profile",
//       },
//       {
//         icon: (
//          <Table/>
//         ),
//         label: "Таблицы",
//         route: "/tables",
//       },
//       {
//         icon: (
//           <Settings/>
//         ),
//         label: "Настройки",
//         route: "/settings",
//       },
//     ],
//   },
// ];

// const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
//   const pathname = usePathname();
//   const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");

//   return (
//     <ClickOutside onClick={() => setSidebarOpen(false)}>
//       <aside
//         className={`fixed left-0 top-0 z-1000 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:translate-x-0 ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         {/* <!-- SIDEBAR HEADER --> */}
//         <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
//           <Link href="/">
//             <Image
//               width={176}
//               height={32}
//               src={"/images/logo/logo.svg"}
//               alt="Logo"
//               priority
//             />
//           </Link>

//           <button
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             aria-controls="sidebar"
//             className="block lg:hidden"
//           >
//             <Menu/>
//           </button>
//         </div>
//         {/* <!-- SIDEBAR HEADER --> */}

//         <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
//           {/* <!-- Sidebar Menu --> */}
//           <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
//             {menuGroups.map((group, groupIndex) => (
//               <div key={groupIndex}>
//                 <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
//                   {group.name}
//                 </h3>

//                 <ul className="mb-6 flex flex-col gap-1.5">
//                   {group.menuItems.map((menuItem, menuIndex) => (
//                     <SidebarItem
//                       key={menuIndex}
//                       item={menuItem}
//                       pageName={pageName}
//                       setPageName={setPageName}
//                     />
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </nav>
//           {/* <!-- Sidebar Menu --> */}
//         </div>
//       </aside>
//     </ClickOutside>
//   );
// };

// export default Sidebar;
"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/src/components/Sidebar/SidebarItem";
import ClickOutside from "@/src/components/ClickOutside";
import useLocalStorage from "@/src/hooks/useLocalStorage";
import { AlarmCheck, AlarmClockCheck, ArrowRight, ArrowUpRight, BookCheck, CalendarDays, ChartArea, History, Menu, Settings, Table, User, UserCircle } from "lucide-react";
import { useSession } from "next-auth/react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const menuGroups = [
  {
    name: "MENU",
    menuItems: [
      {
        icon: <ChartArea />,
        label: "Информационная панель",
        route: "#",
        children: [{ label: "Графики", route: "/" }],
        rolesAllowed: ["admin"], 
      },
      {
        icon: <User />,
        label: "Кандидаты",
        route: "#",
        children:[
          { label: "Все кандидаты", route: "/allCandidates" },
          { label: "Ждут приглашение", route: "/candidate/invitation" },
          { label: "Ждут работу", route: "/candidate/checkWork" },
          { label: "На собеседовании", route: "/candidate/interview" },
          { label: "На объекте", route: "/candidate/inWork" },
        ],
        rolesAllowed: ["admin", "manager", "recruiter"], 
      },
      {
        icon: <BookCheck />,
        label: "Результаты работы",
        route: "/funnel",
        rolesAllowed: ["admin"], 
      },
      {
        icon: <CalendarDays />,
        label: "Календарь",
        route: "/calendar",
        rolesAllowed: ["admin", "manager", "recruiter"], 
      },
      {
        icon: <UserCircle />,
        label: "Профиль",
        route: "/profile",
        rolesAllowed: ["admin", "manager", "recruiter"], 
      },
      {
        icon: <ArrowRight />,
        label: "Переданые кандидаты",
        route: "/toManager",
        rolesAllowed: [ "recruiter"], 
      },
      {
        icon: <History />,
        label: "Последние события",
        route: "/events",
        rolesAllowed: [ "admin"], 
      },
      {
        icon: <AlarmClockCheck />,
        label: "Задачи",
        route: "/tasks",
        rolesAllowed: ["admin", "manager", "recruiter"], 
      },
      {
        icon: <Table />,
        label: "Таблицы",
        route: "/tables",
        rolesAllowed: ["admin", "manager", "recruiter"], // доступно для админа и менеджера
      },
      {
        icon: <Settings />,
        label: "Настройки",
        route: "/settings",
        rolesAllowed: ["admin", "manager", "recruiter"], // доступно только для админа
      },
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const { data: session } = useSession();  // Получаем сессию
  const userRole = session?.managerRole || '';  // Роль пользователя
  const pathname = usePathname();
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed left-0 top-0 z-1000 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* SIDEBAR HEADER */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
          <Link href="/">
            <Image
              width={176}
              height={32}
              src={"/images/logo/logo.svg"}
              alt="Logo"
              priority
            />
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            className="block lg:hidden"
          >
            <Menu />
          </button>
        </div>

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* Sidebar Menu */}
          <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                  {group.name}
                </h3>

                <ul className="mb-6 flex flex-col gap-1.5">
                  {group.menuItems.map(
                    (menuItem, menuIndex) =>
                      // Проверяем, разрешена ли роль для данного пункта меню
                      menuItem.rolesAllowed.includes(userRole) && (
                        <SidebarItem
                          key={menuIndex}
                          item={menuItem}
                          pageName={pageName}
                          setPageName={setPageName}
                        />
                      )
                  )}
                </ul>
              </div>
            ))}
          </nav>
          {/* Sidebar Menu */}
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
