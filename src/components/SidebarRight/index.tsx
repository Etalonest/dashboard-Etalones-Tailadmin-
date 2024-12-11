"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import useLocalStorage from "@/src/hooks/useLocalStorage";
// Импортируем формы
import AddCandidateForm from "@/src/components/forms//FormCandidate/AddCandidateForm"
import EditCandidateForm from "@/src/components/forms//FormCandidate/EditCandidateForm"; // Компонент для редактирования кандидата
import ViewCandidateForm from "@/src/components/forms/FormCandidate/ViewCandidateForm"; // Компонент для просмотра кандидата
import { Candidate } from "@/src/types/candidate";
import { Profession } from "@/src/types/profession"; // Тип для профессий

interface SidebarProps {
  sidebarROpen: boolean;
  setSidebarROpen: (arg: boolean) => void;
  selectedCandidate: Candidate | null
  formType: "addCandidate" | "editCandidate" | "viewCandidate" | null; // Тип формы, которая будет отображаться
  professions: Profession[];
}

const SidebarRight = ({ sidebarROpen, setSidebarROpen, formType, professions, selectedCandidate }: SidebarProps) => {

  const pathname = usePathname();
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");

  // Функция для рендеринга формы в зависимости от типа
  const renderForm = () => {
    switch (formType) {
      case "addCandidate":
        return <AddCandidateForm professions={professions} />;
      case "editCandidate":
        return <EditCandidateForm professions={professions} id={selectedCandidate?._id} candidate={selectedCandidate} />;
      case "viewCandidate":
        return <ViewCandidateForm id={selectedCandidate?._id} candidate={selectedCandidate}/>;
      default:
        return null;
    }
  };
const handleCloseSidebar = () => {
    setSidebarROpen(false);
    // Например, сбрасываем статус о том, что сайдбар закрыт
    localStorage.setItem("sidebarOpen", "false"); // Обновление кэша
  };

  useEffect(() => {
    // При монтировании компонента проверяем, открыт ли сайдбар в localStorage
    const sidebarStatus = localStorage.getItem("sidebarOpen");
    if (sidebarStatus === "false") {
      setSidebarROpen(false);
    }
  }, [setSidebarROpen]);
  return (
    <aside
      id="sidebar"
      className={`fixed right-0 top-0 z-1000 flex h-screen w-full flex-col overflow-y-hidden  bg-white  duration-300 ease-linear dark:bg-boxdark ${
        sidebarROpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* SIDEBAR HEADER */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        {/* Кнопка закрытия (крестик) */}
        <button
          onClick={handleCloseSidebar}
          aria-controls="sidebar"
          className="text-black-2 dark:text-white text-2xl"
        >
          &times; {/* Символ крестика */}
        </button>
      </div>
      {/* SIDEBAR HEADER */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* Рендерим форму в зависимости от типа */}
        {renderForm()}
      </div>
    </aside>
  );
};

export default SidebarRight;
