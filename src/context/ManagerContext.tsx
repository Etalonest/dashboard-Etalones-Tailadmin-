'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from '@/src/context/SessionContext';
import { Manager, PartnerStage } from '../types/manager';
import { Partner } from '../types/partner';

interface ManagerContextType {
  manager: Manager | null;
  setManager: (manager: Manager | null) => void;
  candidates: any[];  
  candidateFromInterview?: any[];
  setCandidates: (candidates: any[]) => void;
  partners: Partner[];
  setPartners: (partners: any[]) => void;
  partnersStage: PartnerStage[];  
  setPartnersStage: (partnersStage: PartnerStage[]) => void
  isLoading: boolean;  
  error: string | null;  
}

const ManagerContext = createContext<ManagerContextType | undefined>(undefined);

export const ManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [manager, setManager] = useState<Manager | null>(null);
  const [candidates, setCandidates] = useState<any[]>([]); 
  const [candidateFromInterview, setCandidateFromInterview] = useState<any[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]); 
  const [partnersStage, setPartnersStage] = useState<PartnerStage[]>([]); 
  const [isLoading, setIsLoading] = useState<boolean>(false);  
  const [error, setError] = useState<string | null>(null);  
  const { session } = useSession();
console.log("candidateFromInterview", candidateFromInterview);
  const managerId = session?.managerId;

  useEffect(() => {
    if (!managerId) return;

    const fetchManager = async () => {
      setIsLoading(true);
      setError(null); // Сброс ошибки при новой попытке загрузки

      try {
        const response = await fetch(`/api/manager/${managerId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch manager');
        }

        const data = await response.json();
        console.log('MANAGER CONTEXT', data);
        if (data.manager) {
          setManager(data.manager); 
          setCandidates(data.manager.candidates || []); 
          setCandidateFromInterview(data.manager.candidateFromInterview || []);
          setPartners(data.manager.partners);
          if (Array.isArray(data.manager.partnersStage)) {
            const validatedPartnersStage = data.manager.partnersStage.map((stage: { peopleOnObj: any[]; inWork: any[]; }) => {
              if (stage.peopleOnObj && Array.isArray(stage.peopleOnObj)) {
                stage.peopleOnObj = stage.peopleOnObj.map(id => id.toString());
              }
              if (stage.inWork && Array.isArray(stage.inWork)) {
                stage.inWork = stage.inWork.map(id => id.toString());
              }
              return stage;
            });
            setPartnersStage(validatedPartnersStage);
          } else {
            setPartnersStage([]);  // Если данные неверны, ставим пустой массив
          }
        }
      } catch (error) {
        console.error('Error fetching manager:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchManager();
  }, [managerId]);

  return (
    <ManagerContext.Provider value={{ manager, setManager, candidates, candidateFromInterview, setCandidates, partners, setPartners, partnersStage, setPartnersStage, isLoading, error }}> 
      {children}
    </ManagerContext.Provider>
  );
};

// Хук для получения контекста
export const useManager = (): ManagerContextType => {
  const context = useContext(ManagerContext);
  if (!context) {
    throw new Error('useManager must be used within a ManagerProvider');
  }
  return context;
};
