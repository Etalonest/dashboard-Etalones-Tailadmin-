"use client"

import * as React from "react"
import { usePathname } from "next/navigation";

import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  MailQuestion,
  Map,
  MapPinned,
  NotebookPen,
  NotebookTabs,
  PieChart,
  Plus,
  Search,
  SearchCheck,
  Settings2,
  SmilePlus,
  SquareTerminal,
  Trash2,
  UserRoundPlus,
} from "lucide-react"

import { NavMain } from "@/components/SideBar/nav-main"
import { NavProjects } from "@/components/SideBar/nav-projects"
import { NavUser } from "@/components/SideBar/nav-user"
import { TeamSwitcher } from "@/components/SideBar/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useRouter } from 'next/navigation';
import { useSession } from "@/src/context/SessionContext";
import { signOut } from "next-auth/react"

// This is sample data.
const data = {
  user: {
    name: "etalones",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Etalones SB",
      logo: GalleryVerticalEnd,
      plan: "Gold",
    },
    
  ],
  navMain: [
    {
      title: "Кандидаты",
      url: "#",
      icon: SquareTerminal,
      isActive: false,
      items: [
        { title: "Все кандидаты", url: "/candidate/stage/all" },
        { title: "Новые кандидаты", url: "/candidate/stage/new", icon: UserRoundPlus },
        { title: "Рекрутируются", url: "/candidate/stage/processing", icon: NotebookPen },
        { title: "На собеседовании", url: "/candidate/interview",icon: MailQuestion },
        { title: "Прошли собеседования", url: "/candidate/stage/interviewPassed", icon: SmilePlus },
        { title: "На объекте", url: "/candidate/stage/onObject", icon: MapPinned },
        { title: "Корзина", url: "/candidate/stage/deleted", icon: Trash2 },
      ],
    },
    {
      title: "Партнёры",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Все партнёры",
          url: "#",
        },
        {
          title: "В обработке",
          url: "#",
        },
        {
          title: "Ждёт людей",
          url: "#",
        },
        {
          title: "Люди на объекте",
          url: "#",
        },
      ],
    },
    {
      title: "Вакансии",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Все вакансии",
          url: "/vacancy/all",
        },
        {
          title: "Актуальные вакансии",
          url: "#",
        },
        {
          title: "Новые вакансии",
          url: "#",
        },
        {
          title: "В приоритете",
          url: "#",
        },
      ],
    },
    {
      title: "Добавить",
      url: "#",
      icon: Settings2,
      items: [
        
        {
          icon: Plus,
          title: "Кандидата",
          url: "/candidate/add",
        },
        {
          icon: Plus,
          title: "Партнёра",
          url: "#",
        },
        {
          icon: Plus,
          title: "Вакансию",
          url: "#",
        },
       
      ],
    },
    {
      title: "Поиск",
      url: "#",
      icon: Search,
      items: [
        
        {
          icon: SearchCheck,
          title: "Кандидата",
          url: "/search?tab=candidate",
        },
        {
          icon: SearchCheck,
          title: "Партнёра",
          url: "/search?tab=partner",
        },
        {
          icon: SearchCheck,
          title: "Вакансии",
          url: "#",
        },
       
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const pathname = usePathname();
  const { session } = useSession(); 
  const managerRole = session?.managerRole || "";
  const isCandidateSection = pathname.startsWith("/candidate");
  const handleLogout = async () => {
      await signOut();
      router.push('/auth/signin');
    }; 
    const filteredNavMain = data.navMain.map((category) => ({
      ...category,
      isActive: category.title === "Кандидаты" ? isCandidateSection : false, 
      items: category.items.filter((item) => 
        item.title !== "Корзина" || managerRole === "admin"
      ),
    }));
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser session={session} logout={handleLogout}  />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
