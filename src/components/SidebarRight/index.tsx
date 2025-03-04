"use client";

import React, { useState, useEffect } from "react";

import AddCandidateForm from "@/src/components/forms/FormCandidate/AddCandidateForm";
import EditCandidateForm from "@/src/components/forms/FormCandidate/EditCandidateForm";
import ViewCandidateForm from "@/src/components/forms/FormCandidate/ViewCandidateForm";
import AddPartnerForm from "@/src/components/forms/FormPartner/AddpartnerForm";
import EditPartnerForm from "@/src/components/forms/FormPartner/EditPartnerForm";
import ViewPartnerForm from "@/src/components/forms/FormPartner/ViewParnterForm";
import AddVacancyForm from "../forms/VacancyForm/AddVacancyForm";
import EditVacancyForm from "../forms/VacancyForm/EditVacancyForm";
import { Candidate } from "@/src/types/candidate";
import { Partner } from "@/src/types/partner";
import FormCreateManager from "@/src/components/forms/FormCreateManager/FormCreateManager";
import { ProfessionPartner } from "@/src/types/professionParnter";
import ViewVacancy from "../forms/VacancyForm/ViewVacancy";
import { VacancyType } from "@/src/types/vacancy";

interface SidebarProps {
  sidebarROpen?: boolean;
  setSidebarROpen: (arg: boolean) => void;
  selectedCandidate?: Candidate | null;
  selectedPartner?: Partner | null;
  selectedVacancy?: VacancyType | null;
  selectedProfession?: ProfessionPartner | null;
  formType?: "addCandidate" | "editCandidate" | "viewCandidate" | "addVacancy" | "editVacancy" | "viewVacancy" | "createManager" | "addPartner" | "viewPartner" | "editPartner" |null;
}

const SidebarRight = ({
  sidebarROpen,
  setSidebarROpen,
  formType,
  selectedCandidate,
  selectedPartner,
  selectedVacancy,
  selectedProfession
}: SidebarProps) => {
  const [formData, setFormData] = useState<Candidate | null>(null);
  const [partnerData, setPartnerData] = useState<Partner | null>(null);
  const [vacancyData, setVacancyData] = useState<VacancyType | null>(null);
  // const [professionData, setProfessionData] = useState<any | null>(null);
  
useEffect(() => {
    if (selectedVacancy) {
      console.log("selectedVacancy updated:", selectedVacancy);
      setVacancyData(selectedVacancy);
    }
  }, [selectedVacancy]);

  useEffect(() => {
    if (selectedPartner) {
      console.log("selectedPartner updated:", selectedPartner);
      setPartnerData(selectedPartner);
    }
  }, [selectedPartner]);

  useEffect(() => {
    console.log("selectedCandidate updated:", selectedCandidate);
    if (selectedCandidate) {
      setFormData(selectedCandidate);
    }
  }, [selectedCandidate]);

  useEffect(() => {
    if (!sidebarROpen) {
      if (formType !== "viewCandidate" && formType !== "viewPartner") {
        setFormData(null); 
      }
    }
  }, [sidebarROpen, formType]); 
  const closeSidebar = () => {
    
    setSidebarROpen(false);
    if (formType !== "viewCandidate" && formType !== "viewPartner") {
      setFormData(null); 
    }
  };
  const renderForm = () => {
    switch (formType) {
      case "addCandidate":
        return <AddCandidateForm  onSubmitSuccess={closeSidebar}/>;
      case "editCandidate":
        return <EditCandidateForm candidate={formData}  onSubmitSuccess={closeSidebar}/>;
      case "viewCandidate":
        return <ViewCandidateForm candidate={formData} />;
      case "createManager":
        return <FormCreateManager onSubmitSuccess={closeSidebar}/>;
      case "addPartner":
        return <AddPartnerForm  onSubmitSuccess={closeSidebar}/>;
      case "editPartner":
        return <EditPartnerForm partner={partnerData} onSubmitSuccess={closeSidebar}/>; 
      case "viewPartner":
        return <ViewPartnerForm partner={partnerData} />;  
      case "addVacancy":
          return <AddVacancyForm  profession={selectedProfession} partner={selectedPartner} onSubmitSuccess={closeSidebar}/>;
      case "editVacancy":
          return <EditVacancyForm vacancy={vacancyData} onSubmitSuccess={closeSidebar}/>; 
      case "viewVacancy": 
          return <ViewVacancy vacancy={vacancyData} onSubmitSuccess={closeSidebar}/>;
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
  }, [setSidebarROpen]);


  return (
    <aside
      id="sidebar"
      className={`fixed right-0 top-0 z-[9990] flex h-screen w-full flex-col overflow-y-hidden bg-white duration-300 ease-linear dark:bg-boxdark ${
        sidebarROpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <button
          onClick={() => {
            setSidebarROpen(false);
            // Не очищаем formData, если это форма для просмотра
            if (formType !== "viewCandidate" && formType !== "viewPartner") {
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
