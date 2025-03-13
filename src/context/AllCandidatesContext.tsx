'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Candidate } from '@/src/types/candidate';
import { useSession } from '@/src/context/SessionContext';

interface AllCandidatesContextType {
  candidates: Candidate[];
  loadCandidates: (managerId: string) => void;
  isLoading: boolean;
  error: string | null;
}

const AllCandidatesContext = createContext<AllCandidatesContextType | undefined>(undefined);

export const AllCandidatesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { session } = useSession();
  const managerId = session?.managerId;

  // Функция для загрузки кандидатов
  const loadCandidates = async (managerId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/candidates?managerId=${managerId}`); // Передаем managerId в запрос
      const data = await response.json();

      if (response.ok) {
        setCandidates(data.candidates); // Обновляем кандидатов
      } else {
        setError(data.message || 'Не удалось загрузить кандидатов');
      }
    } catch (err) {
      setError('Ошибка при загрузке кандидатов');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Загружаем кандидатов, если managerId существует и кандидаты еще не загружены
    if (managerId && candidates.length === 0) {
      loadCandidates(managerId);
    }
  }, [managerId, candidates.length]); // Убираем кандидатов из зависимостей, оставив только managerId

  return (
    <AllCandidatesContext.Provider value={{ candidates, loadCandidates, isLoading, error }}>
      {children}
    </AllCandidatesContext.Provider>
  );
};

export const useCandidates = (): AllCandidatesContextType => {
  const context = useContext(AllCandidatesContext);
  if (!context) {
    throw new Error('useCandidates must be used within a CandidatesProvider');
  }
  return context;
};
