"use client";

import React, { useState, useEffect } from "react";

import AddCandidateForm from "@/src/components/forms/FormCandidate/AddCandidateForm";
import EditCandidateForm from "@/src/components/forms/FormCandidate/EditCandidateForm";
import ViewCandidateForm from "@/src/components/forms/FormCandidate/ViewCandidateForm";
import { Candidate } from "@/src/types/candidate";
import { Profession } from "@/src/types/profession";
import FormCreateManager from "@/src/components/forms/FormCreateManager/FormCreateManager";

interface SidebarProps {
  sidebarROpen?: boolean;
  setSidebarROpen: (arg: boolean) => void;
  selectedCandidate?: Candidate | null;
  formType?: "addCandidate" | "editCandidate" | "viewCandidate" | "createManager" | null;
  professions?: Profession[];
}

const SidebarRight = ({
  sidebarROpen,
  setSidebarROpen,
  formType,
  professions,
  selectedCandidate,
}: SidebarProps) => {
  const [formData, setFormData] = useState<Candidate | null>(null);


  // Логируем selectedCandidate для отладки
  useEffect(() => {
    console.log("selectedCandidate updated:", selectedCandidate);
    if (selectedCandidate) {
      setFormData(selectedCandidate); // Обновление состояния формы
    }
  }, [selectedCandidate]);

  // Очистка данных формы при закрытии сайдбара, за исключением формы для просмотра
  useEffect(() => {
    if (!sidebarROpen) {
      console.log("Sidebar closed, clearing formData");
      if (formType !== "viewCandidate") {
        setFormData(null); // Очистка формы при закрытии сайдбара (не для просмотра)
      }
    }
  }, [sidebarROpen, formType]); // Зависимость от состояния сайдбара и типа формы

  const renderForm = () => {
    switch (formType) {
      case "addCandidate":
        return <AddCandidateForm professions={professions} setSidebarROpen={setSidebarROpen} />;
      case "editCandidate":
        return <EditCandidateForm candidate={formData} professions={professions} />;
      case "viewCandidate":
        return <ViewCandidateForm candidate={formData} />;
      case "createManager":
        return <FormCreateManager />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const storedSidebarStatus = localStorage.getItem("sidebarOpen");
    if (storedSidebarStatus === "false") {
      setSidebarROpen(false);
    }
    localStorage.removeItem("selectedCandidate"); 
  }, []);


  return (
    <aside
      id="sidebar"
      className={`fixed right-0 top-0 z-[9999] flex h-screen w-full flex-col overflow-y-hidden bg-white duration-300 ease-linear dark:bg-boxdark ${
        sidebarROpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <button
          onClick={() => {
            setSidebarROpen(false);
            // Не очищаем formData, если это форма для просмотра
            if (formType !== "viewCandidate") {
              setFormData(null); // Очистка формы при закрытии, если не просмотр
            }
          }}
          aria-controls="sidebar"
          className="text-black-2 dark:text-white text-2xl"
        >
          &times; {/* Символ крестика */}
        </button>
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {renderForm()}
      </div>
    </aside>
  );
};

export default SidebarRight;
