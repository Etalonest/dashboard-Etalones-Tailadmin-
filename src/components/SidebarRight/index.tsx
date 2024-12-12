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
  const [formData, setFormData] = useState<Candidate | null>(null);

  const pathname = usePathname();
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");

  useEffect(() => {
    if (selectedCandidate) {
      setFormData(selectedCandidate);  // Обновляем состояние формы с данными кандидата
    }
  }, [selectedCandidate]);

  const renderForm = () => {
    switch (formType) {
      case "addCandidate":
        return <AddCandidateForm professions={professions} setSidebarROpen={setSidebarROpen}  />;
      case "editCandidate":
        return <EditCandidateForm candidate={formData} professions={professions} />;
      case "viewCandidate":
        return <ViewCandidateForm candidate={formData} />;
      default:
        return null;
    }
  };
  useEffect(() => {
    const storedSidebarStatus = localStorage.getItem("sidebarOpen");
    if (storedSidebarStatus === "false") {
      setSidebarROpen(false);
    }
    // Можно очистить `selectedCandidate` в localStorage
    localStorage.removeItem("selectedCandidate");
  }, []);

  useEffect(() => {
    if (!sidebarROpen) {
      selectedCandidate = null;
    }
  }, [sidebarROpen]);
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
          onClick={() => setSidebarROpen(false)}
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
