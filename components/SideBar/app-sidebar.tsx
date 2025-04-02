"use client"

import * as React from "react"
import { usePathname } from "next/navigation";

import {
  AudioWaveform,
  BookOpen,
  Bot,
  Calendar,
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
import { useEffect, useState } from "react";

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
        { title: "Прошли собеседования", url: "/candidate/interview/success", icon: SmilePlus },
        { title: "Отклонены", url: "/candidate/stage/interviewRejected", icon: Trash2 },
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
          url: "/partner/add",
        },
        {
          icon: Plus,
          title: "Вакансию",
          url: "/vacancy/add",
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
    {
      title: "События",
      url: "/events",
      icon: Calendar,
      items: [
        
        // {
        //   icon: SearchCheck,
        //   title: "Менеджеров",
        //   url: "/events",
        // },
        // {
        //   icon: SearchCheck,
        //   title: "Кандидатов",
        //   url: "/search?tab=partner",
        // },
        
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
  const [candidateCounts, setCandidateCounts] = useState({
    newCandidatesCount: 0,
    inProcessCandidatesCount: 0,
    interviewCandidatesCount: 0,
    interviewSuccessCount: 0,
    onObjectCount: 0,
    interviewRejectedCount: 0,
    
  });
  useEffect(() => {
    const fetchCandidateCounts = async () => {
      try {
        const response = await fetch('/api/candidates/count');
        const data = await response.json();
  
        console.log('Полученные данные кандидатов:', data);  
  
        setCandidateCounts({
          newCandidatesCount: data['Новые кандидаты'] || 0,
          inProcessCandidatesCount: data['Рекрутируются'] || 0,
          interviewCandidatesCount: data['На собеседовании'] || 0,
          interviewSuccessCount: data['Прошли собеседование'] || 0,
          onObjectCount: data['На объекте'] || 0,
          interviewRejectedCount: data['Отклонены'] || 0,
        });
        
      } catch (error) {
        console.error('Ошибка при получении данных кандидатов:', error);
      }
    };
  
    fetchCandidateCounts();
  }, []);
  
  const handleLogout = async () => {
      await signOut();
      router.push('/auth/signin');
    }; 
    const filteredNavMain = data.navMain.map((category) => ({
      ...category,
      isActive: category.title === "Кандидаты" ? isCandidateSection : false, 
      items: category.items.map((item) => {
        if (item.title === "Новые кандидаты") {
          return { ...item, badge: candidateCounts.newCandidatesCount };
        }
        if (item.title === "Рекрутируются") {
          return { ...item, badge: candidateCounts.inProcessCandidatesCount };
        }
        if (item.title === "На собеседовании") {
          return { ...item, badge: candidateCounts.interviewCandidatesCount };
        }
        if (item.title === "Прошли собеседования") {
          return { ...item, badge: candidateCounts.interviewSuccessCount };
        }
        if (item.title === "На объекте") {
          return { ...item, badge: candidateCounts.onObjectCount };
        }
        if (item.title === "Отклонены") {
          return { ...item, badge: candidateCounts.interviewRejectedCount };
        }
        return item;
      }),
    }));
    
    console.log('filteredNavMain:', filteredNavMain);  // Логирование отфильтрованных данных
    
    // const filteredNavMain = data.navMain.map((category) => ({
    //   ...category,
    //   isActive: category.title === "Кандидаты" ? isCandidateSection : false, 
    //   items: category.items.filter((item) => 
    //     item.title !== "Корзина" || managerRole === "admin"
    //   ),
    // }));
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser session={session} logout={handleLogout}  />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
