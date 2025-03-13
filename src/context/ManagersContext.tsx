'use client'

import { useSession } from '@/src/context/SessionContext';
import React, { createContext, useContext, useState, useEffect } from 'react';

// Тип данных менеджера
interface Manager {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  image?: { name: string; data: any; contentType: string };
  candidates: any[];
  partners: any[];
  tasks: any[];
}

// Контекст для всех менеджеров
interface ManagersContextType {
  managers: Manager[];
  setManagers: (managers: Manager[]) => void;
}

const ManagersContext = createContext<ManagersContextType | undefined>(undefined);

// Провайдер контекста
export const ManagersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [managers, setManagers] = useState<Manager[]>([]);
  const { session } = useSession();
  // Получение всех менеджеров
  useEffect(() => {
    if (session?.managerRole !== 'admin') {
      console.log('You are not an admin, managers cannot be fetched.');
      return; // Не делаем запрос
    }
    const fetchManagers = async () => {
      try {
        const response = await fetch('/api/manager');
        if (!response.ok) {
          throw new Error('Failed to fetch managers');
        }

        const data = await response.json();
        if (data.managers) {
          setManagers(data.managers);  // Сохраняем всех менеджеров
        }
      } catch (error) {
        console.error('Error fetching managers:', error);
      }
    };

    fetchManagers();
  }, [session?.managerRole]);

  return (
    <ManagersContext.Provider value={{ managers, setManagers }}>
      {children}
    </ManagersContext.Provider>
  );
};

// Хук для получения контекста
export const useManagers = (): ManagersContextType => {
  const context = useContext(ManagersContext);
  if (!context) {
    throw new Error('useManagers must be used within a ManagersProvider');
  }
  return context;
};
