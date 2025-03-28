"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  NotebookTabs,
  PieChart,
  Plus,
  Settings2,
  SquareTerminal,
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
        {
          title: "Все кандидаты",
          url: "/candidate/all",
          stageId: process.env.NEXT_PUBLIC_STAGE_ALL_CANDIDATES
        },
        {
          title: "Новые кандидаты",
          url: "/candidate/new",
          stageId: process.env.NEXT_PUBLIC_STAGE_NEW
        },
        {
          title: "В обработке",
          url: "/testPage/inProcess",
          stageId: process.env.NEXT_PUBLIC_STAGE_IN_PROCESS
        },
        {
          title: "На собеседовании",
          url: "/testPage/interview",
          stageId: process.env.NEXT_PUBLIC_STAGE_ON_INTERVIEW
        },
        {
          title: "Прошли собеседования",
          url: "/testPage/passedInterview",
          stageId: process.env.NEXT_PUBLIC_STAGE_INTERVIEW_SUCCESS
        },
        {
          title: "На объекте",
          url: "/tables/onObject",
          stageId: process.env.NEXT_PUBLIC_STAGE_ON_OBJECT
        },
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
          url: "#",
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
  const { session } = useSession(); 
  const handleLogout = async () => {
      await signOut();
      router.push('/auth/signin');
    }; 
    
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser session={session} logout={handleLogout}  />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
