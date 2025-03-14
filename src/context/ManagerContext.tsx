import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from '@/src/context/SessionContext';
import { Manager } from '../types/manager';

interface ManagerContextType {
  manager: Manager | null;
  setManager: (manager: Manager | null) => void;
  candidates: any[];  // Массив кандидатов
  setCandidates: (candidates: any[]) => void;
  isLoading: boolean;  // Индикатор загрузки
  error: string | null;  // Ошибка
}

const ManagerContext = createContext<ManagerContextType | undefined>(undefined);

export const ManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [manager, setManager] = useState<Manager | null>(null);
  const [candidates, setCandidates] = useState<any[]>([]); // Состояние для кандидатов
  const [isLoading, setIsLoading] = useState<boolean>(false);  // Индикатор загрузки
  const [error, setError] = useState<string | null>(null);  // Ошибка при загрузке данных
  const { session } = useSession();

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
        if (data.manager) {
          setManager(data.manager);  // Сохраняем данные менеджера
          setCandidates(data.manager.candidates || []);  // Сохраняем кандидатов
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
    <ManagerContext.Provider value={{ manager, setManager, candidates, setCandidates, isLoading, error }}>
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
