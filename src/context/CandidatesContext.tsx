'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Candidate } from '@/src/types/candidate';

interface CandidatesContextType {
  candidates: Candidate[];
  loadCandidates: (managerId: string) => void;
  isLoading: boolean;
  error: string | null;
}

const CandidatesContext = createContext<CandidatesContextType | undefined>(undefined);

export const CandidatesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadCandidates = async (managerId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/candidate-by-manager/${managerId}`); // изменено на plural
      const data = await response.json();

      if (response.ok) {
        setCandidates(data.candidates); // Предполагаем, что сервер возвращает кандидатов в объекте { candidates }
      } else {
        setError(data.message || 'Не удалось загрузить кандидатов');
      }
    } catch (err) {
      setError('Ошибка при загрузке кандидатов');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CandidatesContext.Provider value={{ candidates, loadCandidates, isLoading, error }}>
      {children}
    </CandidatesContext.Provider>
  );
};

export const useCandidates = (): CandidatesContextType => {
  const context = useContext(CandidatesContext);
  if (!context) {
    throw new Error('useCandidates must be used within a CandidatesProvider');
  }
  return context;
};
