'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Candidate } from '@/src/types/candidate';
import { saveToIndexedDB, getFromIndexedDB } from '@/src/local/db';  // Функции для работы с IndexedDB

interface CandidatesContextType {
  candidates: Candidate[];
  loadCandidates: () => void;
  loadMoreCandidates: () => void;
  isLoading: boolean;
  error: string | null;
  hasMore: boolean; // Флаг, чтобы узнать, есть ли еще кандидаты для загрузки
}

const CandidatesContext = createContext<CandidatesContextType | undefined>(undefined);

export const CandidatesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);  // Изначально пустой список кандидатов
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1); // Начальная страница
  const [hasMore, setHasMore] = useState<boolean>(true); // Есть ли еще кандидаты для загрузки?

  const loadCandidates = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Попытка загрузить кандидатов из IndexedDB
      const localCandidates = await getFromIndexedDB('candidates', 'candidates');  // Передаем key

      if (localCandidates.length > 0) {
        setCandidates(localCandidates);  // Если кандидаты есть в базе, используем их
      } else {
        const response = await fetch(`/api/candidates/forAll?page=${page}`);  // Добавим пагинацию в запрос
        const data = await response.json();

        if (response.ok) {
          setCandidates(data.candidates);
          setHasMore(data.candidates.length > 0); // Проверка, есть ли еще кандидаты для загрузки
          // Сохраняем кандидатов в IndexedDB
          saveToIndexedDB('candidates', 'candidates', data.candidates);
        } else {
          setError(data.message || 'Не удалось загрузить кандидатов');
        }
      }
    } catch (err) {
      setError('Ошибка при загрузке кандидатов');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreCandidates = async () => {
    if (isLoading || !hasMore) return;  // Если загрузка в процессе или кандидаты закончились, не делаем запрос

    setIsLoading(true);
    setPage((prevPage) => prevPage + 1);  // Переходим на следующую страницу

    try {
      const response = await fetch(`/api/candidates/forAll?page=${page}`);
      const data = await response.json();

      if (response.ok) {
        setCandidates((prevCandidates) => [...prevCandidates, ...data.candidates]);  // Добавляем новых кандидатов к уже загруженным
        setHasMore(data.candidates.length > 0);  // Проверка, есть ли еще кандидаты для загрузки
        saveToIndexedDB('candidates', 'candidates', data.candidates); // Сохраняем в IndexedDB
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
    if (candidates.length === 0) {
      loadCandidates();  // Если кандидаты еще не загружены, загружаем их
    }
  }, [candidates]);

  return (
    <CandidatesContext.Provider value={{ candidates, loadCandidates, loadMoreCandidates, isLoading, error, hasMore }}>
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
