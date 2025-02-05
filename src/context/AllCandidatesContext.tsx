'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Candidate } from '@/src/types/candidate';
import { useSession } from 'next-auth/react';

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
  const { data: session } = useSession();
  const managerId = session?.managerId;
  const loadCandidates = async (managerId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/candidates');
      const data = await response.json();

      if (response.ok) {
        if (candidates.length === 0) {
          setCandidates(data.candidates);
        }
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
    if (managerId && candidates.length === 0) {
      loadCandidates(managerId); // Используйте правильный ID
    }
  }, [candidates, managerId]); // Зависят от candidates и managerId, чтобы избежать повторных запросов

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
