// src/context/ManagerContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from '@/src/context/SessionContext';
import { Manager } from '../types/manager';


interface ManagerContextType {
  manager: Manager | null;
  setManager: (manager: Manager | null) => void;
}

const ManagerContext = createContext<ManagerContextType | undefined>(undefined);

export const ManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [manager, setManager] = useState<Manager | null>(null);
  const { session } = useSession();

  const managerId = session?.managerId;

  useEffect(() => {
    if (!managerId) return; 

    const fetchManager = async () => {
      try {
        const response = await fetch(`/api/manager/${managerId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch manager');
        }

        const data = await response.json();
        if (data.manager) {
          setManager(data.manager);  // Сохраняем данные менеджера
        }
      } catch (error) {
        console.error('Error fetching manager:', error);
      }
    };

    fetchManager();
  }, [managerId]);

  return (
    <ManagerContext.Provider value={{ manager, setManager }}>
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
