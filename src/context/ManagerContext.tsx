'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from '@/src/context/SessionContext';
import { Manager } from '../types/manager';
import { Partner } from '../types/partner';

interface ManagerContextType {
  manager: Manager | null;
  setManager: (manager: Manager | null) => void;
  candidates: any[];  
  candidateFromInterview?: any[];
  setCandidates: (candidates: any[]) => void;
  partner: any[];
  setPartner: (partner: any[]) => void;
  isLoading: boolean;  // Индикатор загрузки
  error: string | null;  // Ошибка
}

const ManagerContext = createContext<ManagerContextType | undefined>(undefined);

export const ManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [manager, setManager] = useState<Manager | null>(null);
  const [candidates, setCandidates] = useState<any[]>([]); 
  const [candidateFromInterview, setCandidateFromInterview] = useState<any[]>([]);
  const [partner, setPartner] = useState<any[]>([]); // Состояние для партнеров
  const [isLoading, setIsLoading] = useState<boolean>(false);  // Индикатор загрузки
  const [error, setError] = useState<string | null>(null);  // Ошибка при загрузке данных
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
          setManager(data.manager);  // Сохраняем данные менеджера
          setCandidates(data.manager.candidates || []); 
          setCandidateFromInterview(data.manager.candidateFromInterview || []);
          setPartner(data.manager.partner);
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
    <ManagerContext.Provider value={{ manager, setManager, candidates, candidateFromInterview, setCandidates, partner, setPartner, isLoading, error }}>
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
