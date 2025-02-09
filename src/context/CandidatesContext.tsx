'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Candidate } from '@/src/types/candidate';
import { useSession } from 'next-auth/react';

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
  const { data: session } = useSession();
  const managerId = session?.managerId;

  // Оборачиваем функцию loadCandidates в useCallback, чтобы избежать её пересоздания
  const loadCandidates = useCallback(async (managerId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/candidate-by-manager/${managerId}`);
      const data = await response.json();

      if (response.ok) {
        // Если кандидаты уже загружены, не делаем повторный запрос
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
  }, [candidates.length]); // Добавляем зависимость от length, чтобы предотвратить повторные запросы

  useEffect(() => {
    // Проверка, если кандидаты уже есть, то не загружаем их снова
    if (managerId && candidates.length === 0) {
      loadCandidates(managerId); // Используйте правильный ID
    }
  }, [candidates.length, managerId, loadCandidates]); // Пересчитываем, если менеджер или список кандидатов изменяется

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
