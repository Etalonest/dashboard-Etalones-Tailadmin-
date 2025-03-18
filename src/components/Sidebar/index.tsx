"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/src/components/Sidebar/SidebarItem";
import ClickOutside from "@/src/components/ClickOutside";
import useLocalStorage from "@/src/hooks/useLocalStorage";
import { AlarmClockCheck, ChartArea, Search, User, NotebookText, BookCheck, CalendarDays, UserCircle, History, Table, Camera, Settings, Menu } from "lucide-react";
import { useSession } from "@/src/context/SessionContext";

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
        route: "",
        rolesAllowed: ["admin", "manager", "recruiter"],
        children: [
          { label: "Кандидата", route: "/search" },
          { label: "Партнёра", route: "/search" },
          
        ],
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
          { label: "Прибывает на обьёкт", route: "/candidate/checkDA" },
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
          { label: "Прибывает на обьёкт", route: "/candidate/checkDA" },
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
  const { session } = useSession();
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
       className={`fixed left-0 top-0  flex h-screen w-72.5 flex-col 
        overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      
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
