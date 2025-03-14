'use client'

import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SalesmanTab } from "./SalesmanTab";
import { PartnerTab } from "./PartnerTab";
import { RecruiterTab } from "./RecruiterTab";
import { ManagersTab } from "./ManagerTab";
import { useSession } from "@/src/context/SessionContext";
import { useManagers } from "@/src/context/ManagersContext";
import { UsersTab } from "./UsersTab";
import {CandidateTable} from "./CandidateTable/CandidateTable";
import CandidatesInWork from "../../CandidatesInWork/CandidatesInWork";
import TasksList from "../../tasksList/TasksList";

export function TabsAdmin() {
  const { session } = useSession(); 
  const [activeTab, setActiveTab] = useState("candidate");
  const { managers, setManagers } = useManagers(); // Получаем менеджеров из контекста


  const renderTabContent = (activeTab: string) => {
    switch (activeTab) {
      case "users":
        return <UsersTab />;
      case "tasks":
        return <TasksList />;
      // case "managers":
      //   return <ManagersTab managers={managers} onClick={toggleSidebar} />;
      case "salles":
        return <SalesmanTab />;
      case "candidate":
        return <CandidateTable />;
      // case "candidateIsInWork":
      //   return <CandidatesInWork />;
      case "partner":
        return <PartnerTab />;
      case "recruiter":
        return <RecruiterTab />;
      default:
        return <CandidatesInWork />;
    }
  };

  // Запрос менеджеров, если роль администратора
  useEffect(() => {
    if (session?.managerRole === 'admin') {
      const fetchManagers = async () => {
        try {
          const response = await fetch('/api/manager');
          if (!response.ok) {
            throw new Error('Failed to fetch managers');
          }

          const data = await response.json();
          if (data.managers) {
            setManagers(data.managers);  // Сохраняем менеджеров в контексте
          }
        } catch (error) {
          console.error('Error fetching managers:', error);
        }
      };
      fetchManagers();
    }
  }, [session?.managerRole, setManagers]);

  const tabs = [
    { value: "users", label: "Пользователи" },
    { value: "managers", label: "Менеджеры" },
    { value: "salles", label: "Продажники" },
    { value: "candidate", label: "Кандидаты" },
    // { value: "candidateIsInWork", label: "Кандидаты в работе" },
    { value: "tasks", label: "Задачи" },
    { value: "partner", label: "Партнёры" },
    { value: "recruiter", label: "Рекрутеры" }
  ];

  const visibleTabs = session?.managerRole === 'admin'
    ? tabs
    : tabs.filter(tab => tab.value !== 'managers' && tab.value !== 'recruiter' && tab.value !== 'partner' && tab.value !== 'users' && tab.value !== 'salles');

  return (
    <>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full ">
        <TabsList className="flex gap-2 flex-wrap w-full mb-2">
          {visibleTabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={`${activeTab === tab.value ? 'bg-slate-300 text-black border-2 border-slate-500' : 'bg-slate-200 border-slate-300 border-2'} px-5 py-2.5 rounded cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-300`}
              >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-3">
          {renderTabContent(activeTab)}
        </TabsContent>
      </Tabs>
    </>
  );
}
