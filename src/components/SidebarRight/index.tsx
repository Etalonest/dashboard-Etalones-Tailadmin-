"use client";

import React from "react";
import { useSidebar } from "@/src/context/SidebarContext";
import AddCandidateForm from "@/src/components/forms/FormCandidate/AddCandidateForm";
import EditCandidateForm from "@/src/components/forms/FormCandidate/EditCandidateForm";
import ViewCandidateForm from "@/src/components/forms/FormCandidate/ViewCandidateForm";
import AddPartnerForm from "@/src/components/forms/FormPartner/AddpartnerForm";
import EditPartnerForm from "@/src/components/forms/FormPartner/EditPartnerForm";
import ViewPartnerForm from "@/src/components/forms/FormPartner/ViewParnterForm";
import AddVacancyForm from "../forms/VacancyForm/AddVacancyForm";
import EditVacancyForm from "../forms/VacancyForm/EditVacancyForm";
import ViewVacancy from "../forms/VacancyForm/ViewVacancy";
import FormCreateManager from "../forms/FormCreateManager/FormCreateManager";

const SidebarRight: React.FC = () => {
  const {
    sidebarROpen,
    setSidebarROpen,
    formType,
    selectedCandidate,
    selectedPartner,
    selectedVacancy,
    selectedProfession,
  } = useSidebar();

  const closeSidebar = () => {
    setSidebarROpen(false);
    if (formType !== "viewCandidate" && formType !== "viewPartner" && formType !== "viewVacancy") {
    }
  };

  const renderForm = () => {
    switch (formType) {
      case "addCandidate":
        return <AddCandidateForm onSubmitSuccess={closeSidebar} />;
      case "editCandidate":
        return <EditCandidateForm candidate={selectedCandidate} onSubmitSuccess={closeSidebar} />;
      case "viewCandidate":
        return <ViewCandidateForm candidate={selectedCandidate} />;
      case "createManager":
        return <FormCreateManager onSubmitSuccess={closeSidebar} />;
      case "addPartner":
        return <AddPartnerForm onSubmitSuccess={closeSidebar} />;
      case "editPartner":
        return <EditPartnerForm partner={selectedPartner} onSubmitSuccess={closeSidebar} />;
      case "viewPartner":
        return <ViewPartnerForm partner={selectedPartner} />;
      case "addVacancy":
        return <AddVacancyForm profession={selectedProfession} partner={selectedPartner} onSubmitSuccess={closeSidebar} />;
      case "editVacancy":
        return <EditVacancyForm vacancy={selectedVacancy} onSubmitSuccess={closeSidebar} />;
        case "viewVacancy":
          if (!selectedVacancy) {
            return <div>Загрузка...</div>; 
          }
          return <ViewVacancy vacancy={selectedVacancy} onSubmitSuccess={closeSidebar} />;
          default:
        return null;
    }
  };

  return (
    <aside
      id="sidebar"
      className={`fixed right-0 top-0 z-[9990] flex h-screen w-full flex-col overflow-y-hidden bg-white duration-300 ease-linear dark:bg-boxdark ${sidebarROpen ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <button
          onClick={() => {
            setSidebarROpen(false);
            if (formType !== "viewCandidate" && formType !== "viewPartner") {
              // Очистка формы при закрытии, если не просмотр
            }
          }}
          aria-controls="sidebar"
          className="text-black-2 dark:text-white text-2xl"
        >
          &times;
        </button>
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {renderForm()}
      </div>
    </aside>
  );
};

export default SidebarRight;
