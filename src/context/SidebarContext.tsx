import React, { createContext, useContext, useState, ReactNode } from "react";
import { Candidate } from "@/src/types/candidate";
import { Partner } from "@/src/types/partner";
import { VacancyType } from "@/src/types/vacancy";
import { ProfessionPartner } from "@/src/types/professionParnter";

// Типизация контекста
interface SidebarContextType {
  sidebarROpen: boolean;
  setSidebarROpen: (open: boolean) => void;
  formType: string | null;
  setFormType: (formType: string | null) => void;
  selectedCandidate: Candidate | null;
  setSelectedCandidate: (candidate: Candidate | null) => void;
  selectedPartner: Partner | null;
  setSelectedPartner: (partner: Partner | null) => void;
  selectedVacancy: VacancyType | null;
  setSelectedVacancy: (vacancy: VacancyType | null) => void;
  selectedProfession: ProfessionPartner | null;
  setSelectedProfession: (profession: ProfessionPartner | null) => void;
}

// Создание контекста с типом
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// Поставщик контекста
export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [sidebarROpen, setSidebarROpen] = useState<boolean>(false);
  const [formType, setFormType] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [selectedVacancy, setSelectedVacancy] = useState<VacancyType | null>(null);
  const [selectedProfession, setSelectedProfession] = useState<ProfessionPartner | null>(null);

  console.log("Profession", selectedProfession);
  console.log("SelectedVACANCY", selectedVacancy);


  return (
    <SidebarContext.Provider
      value={{
        sidebarROpen,
        setSidebarROpen,
        formType,
        setFormType,
        selectedCandidate,
        setSelectedCandidate,
        selectedPartner,
        setSelectedPartner,
        selectedVacancy,
        setSelectedVacancy,
        selectedProfession,
        setSelectedProfession,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

// Хук для использования контекста
export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
