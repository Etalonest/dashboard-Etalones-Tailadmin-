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
// "use client";

// import React from "react";
// import Link from "next/link";
// import Image from "next/image";
// import SidebarItem from "@/src/components/Sidebar/SidebarItem";
// import ClickOutside from "@/src/components/ClickOutside";
// import useLocalStorage from "@/src/hooks/useLocalStorage";
// import {  AlarmClockCheck, ArrowRight, BookCheck, CalendarDays, Camera, ChartArea, History, Menu, NotebookText, Search, Settings, Table, User, UserCircle } from "lucide-react";
// import { useSession } from "next-auth/react";

// interface SidebarProps {
//   sidebarOpen: boolean;
//   setSidebarOpen: (arg: boolean) => void;
// }

// const menuGroups = [
//   {
//     name: "Меню",
//     menuItems: [
//       {
//         icon: <ChartArea />,
//         label: "Информационная панель",
//         route: "#",
//         children: [{ label: "Графики", route: "/" }],
//         rolesAllowed: ["admin"], 
//       },
//       {
//         icon: <Search />,
//         label: "Поиск",
//         route: "/search",
//         rolesAllowed: ["admin", "manager", "recruiter"],
//       },
//       {
//         icon: <User />,
//         label: "Кандидаты",
//         route: "#",
//         children:[
//           { label: "Все кандидаты", route: "/allCandidates" },
//           { label: "Ждут работу", route: "/candidate/checkWork" },
//           { label: "Ждут приглашение", route: "/candidate/invitation" },
//           { label: "На собеседовании", route: "/candidate/interview" },
//           { label: "На объекте", route: "/candidate/inWork" },
//         ],
//         rolesAllowed: ["recruiter"], 
//       },
//       {
//         icon: <User />,
//         label: "Кандидаты",
//         route: "#",
//         children:[
//           { label: "Все кандидаты", route: "/allCandidates" },
//           { label: "Ждут работу", route: "/candidate/checkWork" },
//           { label: "От рекрутера", route: "/candidate/fromRecruiter"},
//           { label: "Ждут приглашение", route: "/candidate/invitation" },
//           { label: "На собеседовании", route: "/candidate/interview" },
//           { label: "На объекте", route: "/candidate/inWork" },
//         ],
//         rolesAllowed: ["admin", "manager"], 
//       },
//       {
//         icon: <NotebookText />,
//         label: "Вакансии",
//         route: "/vacancy",
//         rolesAllowed: ["admin"], 
//       },
//       {
//         icon: <BookCheck />,
//         label: "Результаты работы",
//         route: "/funnel",
//         rolesAllowed: ["admin"], 
//       },
//       {
//         icon: <CalendarDays />,
//         label: "Календарь",
//         route: "/calendar",
//         rolesAllowed: ["admin", "manager", "recruiter"], 
//       },
//       {
//         icon: <UserCircle />,
//         label: "Профиль",
//         route: "/profile",
//         rolesAllowed: ["admin", "manager", "recruiter"], 
//       },
//       // {
//       //   icon: <ArrowRight />,
//       //   label: "Переданые кандидаты",
//       //   route: "/toManager",
//       //   rolesAllowed: [ "recruiter"], 
//       // },
//       {
//         icon: <History />,
//         label: "Последние события",
//         route: "/events",
//         rolesAllowed: [ "admin"], 
//       },
//       {
//         icon: <AlarmClockCheck />,
//         label: "Задачи",
//         route: "/tasks",
//         rolesAllowed: ["admin", "manager", "recruiter"],
//         children: [
//           { label: 'Все задачи', route: '/tasks' },
//           { label: 'Выполненные задачи', route: '/tasks?status=выполнена', rolesAllowed: ['admin'] },
//           { label: 'Не выполненные задачи', route: '/tasks?status=не выполнена', rolesAllowed: ['admin'] },
//           { label: 'Отменённые задачи', route: '/tasks?status=отменено' },
//         ], 
//       },
//       {
//         icon: <Table />,
//         label: "Таблицы",
//         route: "/tables",
//         rolesAllowed: ["admin", "manager", "recruiter"], 
//       },
//       {
//         icon: <Camera />,
//         label: "Контент",
//         route: "/content",
//         rolesAllowed: ["admin", "manager", "recruiter"], // доступно только для админа
//       },
//       {
//         icon: <Settings />,
//         label: "Настройки",
//         route: "/settings",
//         rolesAllowed: ["admin", "manager", "recruiter"], // доступно только для админа
//       },
//     ],
//   },
// ];
// const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
//   const { data: session } = useSession();  // Получаем сессию
//   const userRole = session?.managerRole || '';  // Роль пользователя
//   const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");

//   console.log("ROLE", userRole);

//   return (
//     <ClickOutside onClick={() => setSidebarOpen(false)}>
//       <aside
//         className={`fixed left-0 top-0 z-1000 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
//       >
//         {/* SIDEBAR HEADER */}
//         <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
//           <Link href="/">
//             <Image width={176} height={32} src="/images/logo/logo.svg" alt="Logo" priority />
//           </Link>

//           <button
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             aria-controls="sidebar"
//             className="block lg:hidden"
//           >
//             <Menu />
//           </button>
//         </div>

//         <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
//           {/* Sidebar Menu */}
//           <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
//             {menuGroups.map((group, groupIndex) => (
//               <div key={groupIndex}>
//                 <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
//                   {group.name}
//                 </h3>

//                 <ul className="mb-6 flex flex-col gap-1.5">
//                   {group.menuItems.map((menuItem, menuIndex) => {
//                     // Фильтруем родительский элемент по доступным ролям
//                     const isParentAllowed = menuItem.rolesAllowed.includes(userRole);

//                     // Если у пункта меню есть дочерние элементы
//                     if (menuItem.children) {
//                       // Фильтруем дочерние элементы по ролям
//                       menuItem.children = menuItem.children.filter((child) => 
//                         !child.rolesAllowed || child.rolesAllowed.includes(userRole)
//                       );
//                     }

//                     // Рендерим родительский элемент, если он доступен или у него есть доступные дочерние элементы
//                     if (isParentAllowed || (menuItem.children && menuItem.children.length > 0)) {
//                       return (
//                         <SidebarItem
//                           key={menuIndex}
//                           item={menuItem}
//                           pageName={pageName}
//                           setPageName={setPageName}
//                         />
//                       );
//                     }
//                     return null; // Если родительский элемент и его дочерние элементы не доступны, не рендерим его
//                   })}
//                 </ul>
//               </div>
//             ))}
//           </nav>
//           {/* Sidebar Menu */}
//         </div>
//       </aside>
//     </ClickOutside>
//   );
// };

// export default Sidebar;
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/src/components/Sidebar/SidebarItem";
import ClickOutside from "@/src/components/ClickOutside";
import useLocalStorage from "@/src/hooks/useLocalStorage";
import { AlarmClockCheck, ChartArea, Search, User, NotebookText, BookCheck, CalendarDays, UserCircle, History, Table, Camera, Settings, Menu } from "lucide-react";
import { useSession } from "next-auth/react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const menuGroups = [
  {
    name: "Меню",
    menuItems: [
      {
        key: "dashboard",
        icon: <ChartArea />,
        label: "Информационная панель",
        route: "#",
        children: [{ label: "Графики", route: "/" }],
        rolesAllowed: ["admin"],
      },
      {
        key: "search",
        icon: <Search />,
        label: "Поиск",
        route: "/search",
        rolesAllowed: ["admin", "manager", "recruiter"],
      },
      {
        key: "candidates",
        icon: <User />,
        label: "Кандидаты",
        route: "#",
        children: [
          { label: "Все кандидаты", route: "/allCandidates" },
          { label: "Ждут работу", route: "/candidate/checkWork" },
          { label: "Ждут приглашение", route: "/candidate/invitation" },
          { label: "На собеседовании", route: "/candidate/interview" },
          { label: "На объекте", route: "/candidate/inWork" },
        ],
        rolesAllowed: ["recruiter"],
      },
      {
        key: "candidates",
        icon: <User />,
        label: "Кандидаты",
        route: "#",
        children: [
          { label: "Все кандидаты", route: "/allCandidates" },
          { label: "Ждут работу", route: "/candidate/checkWork" },
          { label: "От рекрутера", route: "/candidate/fromRecruiter" },
          { label: "Ждут приглашение", route: "/candidate/invitation" },
          { label: "На собеседовании", route: "/candidate/interview" },
          { label: "На объекте", route: "/candidate/inWork" },
        ],
        rolesAllowed: ["admin", "manager"],
      },
      {
        key: "vacancies",
        icon: <NotebookText />,
        label: "Вакансии",
        route: "/vacancy",
        rolesAllowed: ["admin"],
      },
      {
        key: "results",
        icon: <BookCheck />,
        label: "Результаты работы",
        route: "/funnel",
        rolesAllowed: ["admin"],
      },
      {
        key: "calendar",
        icon: <CalendarDays />,
        label: "Календарь",
        route: "/calendar",
        rolesAllowed: ["admin"],
      },
      {
        key: "profile",
        icon: <UserCircle />,
        label: "Профиль",
        route: "/profile",
        rolesAllowed: ["admin"],
      },
      {
        key: "events",
        icon: <History />,
        label: "Последние события",
        route: "/events",
        rolesAllowed: ["admin"],
      },
      {
        key: "tasks",
        icon: <AlarmClockCheck />,
        label: "Задачи",
        route: "/tasks",
        rolesAllowed: ["admin", "manager", "recruiter"],
        children: [
          { label: "Все задачи", route: "/tasks" },
          { label: "Выполненные задачи", route: "/tasks?status=выполнена", rolesAllowed: ["admin"] },
          { label: "Не выполненные задачи", route: "/tasks?status=не выполнена", rolesAllowed: ["admin"] },
          { label: "Отменённые задачи", route: "/tasks?status=отменено" },
        ],
      },
      {
        key: "tables",
        icon: <Table />,
        label: "Таблицы",
        route: "/tables",
        rolesAllowed: ["admin", "manager", "recruiter"],
      },
      {
        key: "content",
        icon: <Camera />,
        label: "Контент",
        route: "/content",
        rolesAllowed: ["admin", "manager"],
      },
      {
        key: "settings",
        icon: <Settings />,
        label: "Настройки",
        route: "/settings",
        rolesAllowed: ["admin"],
      },
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const { data: session } = useSession();
  const userRole = session?.managerRole || "";
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");

  console.log("ROLE", userRole);

  // Фильтруем дублирующиеся пункты с одинаковым key, оставляя только первый доступный
  const filteredMenuGroups = menuGroups.map((group) => {
    const uniqueItems = new Map<string, any>();
  
    group.menuItems.forEach((menuItem) => {
      const isParentAllowed = menuItem.rolesAllowed.includes(userRole);
      const filteredChildren =
        menuItem.children?.filter((child) => !child.rolesAllowed || child.rolesAllowed.includes(userRole)) || [];
  
      if (isParentAllowed || filteredChildren.length > 0) {
        const existingItem = uniqueItems.get(menuItem.key);
  
        // Если такого пункта ещё нет или он менее приоритетный, заменяем
        if (!existingItem || menuItem.rolesAllowed.includes(userRole)) {
          uniqueItems.set(menuItem.key, { ...menuItem, children: filteredChildren });
        }
      }
    });
  
    return { ...group, menuItems: Array.from(uniqueItems.values()) };
  });
  

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed left-0 top-0 z-1000 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Заголовок сайдбара */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
          <Link href="/">
            <Image width={176} height={32} src="/images/logo/logo.svg" alt="Logo" priority />
          </Link>

          <button onClick={() => setSidebarOpen(!sidebarOpen)} aria-controls="sidebar" className="block lg:hidden">
            <Menu />
          </button>
        </div>

        {/* Контент сайдбара */}
        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
            {filteredMenuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">{group.name}</h3>

                <ul className="mb-6 flex flex-col gap-1.5">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem key={menuIndex} item={menuItem} pageName={pageName} setPageName={setPageName} />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
