// 'use client';
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { Candidate } from '@/src/types/candidate';

// interface CandidatesContextType {
//   candidates: Candidate[];
//   loadCandidates: () => void;
//   loadMoreCandidates: () => void;
//   isLoading: boolean;
//   error: string | null;
//   hasMore: boolean; // Флаг, чтобы узнать, есть ли еще кандидаты для загрузки
// }

// const CandidatesContext = createContext<CandidatesContextType | undefined>(undefined);

// export const CandidatesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [candidates, setCandidates] = useState<Candidate[]>([]);  // Изначально пустой список кандидатов
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [page, setPage] = useState<number>(1); // Начальная страница
//   const [hasMore, setHasMore] = useState<boolean>(true); // Есть ли еще кандидаты для загрузки?

//   const loadCandidates = async () => {
//     setIsLoading(true);
//     setError(null);

//     try {

//        {
//         const response = await fetch(`/api/candidates/forAll?page=${page}`);  // Добавим пагинацию в запрос
//         const data = await response.json();

//         if (response.ok) {
//           setCandidates(data.candidates);
//         } else {
//           setError(data.message || 'Не удалось загрузить кандидатов');
//         }
//       }
//     } catch (err) {
//       setError('Ошибка при загрузке кандидатов');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const loadMoreCandidates = async () => {
//     if (isLoading || !hasMore) return;  // Если загрузка в процессе или кандидаты закончились, не делаем запрос

//     setIsLoading(true);
//     setPage((prevPage) => prevPage + 1);  // Переходим на следующую страницу

//     try {
//       const response = await fetch(`/api/candidates/forAll?page=${page}`);
//       const data = await response.json();

//       if (response.ok) {
//         setCandidates((prevCandidates) => [...prevCandidates, ...data.candidates]);  // Добавляем новых кандидатов к уже загруженным
//       } else {
//         setError(data.message || 'Не удалось загрузить кандидатов');
//       }
//     } catch (err) {
//       setError('Ошибка при загрузке кандидатов');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (candidates.length === 0) {
//       loadCandidates();  // Если кандидаты еще не загружены, загружаем их
//     }
//   }, [candidates, loadCandidates]);

//   return (
//     <CandidatesContext.Provider value={{ candidates, loadCandidates, loadMoreCandidates, isLoading, error, hasMore }}>
//       {children}
//     </CandidatesContext.Provider>
//   );
// };

// export const useCandidates = (): CandidatesContextType => {
//   const context = useContext(CandidatesContext);
//   if (!context) {
//     throw new Error('useCandidates must be used within a CandidatesProvider');
//   }
//   return context;
// };
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Candidate } from '@/src/types/candidate';

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

  // Окружение loadCandidates в useCallback, чтобы она не менялась при каждом рендере
  const loadCandidates = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/candidates/forAll?page=${page}`);  // Добавим пагинацию в запрос
      const data = await response.json();

      if (response.ok) {
        setCandidates(data.candidates);
      } else {
        setError(data.message || 'Не удалось загрузить кандидатов');
      }
    } catch (err) {
      setError('Ошибка при загрузке кандидатов');
    } finally {
      setIsLoading(false);
    }
  }, [page]); // Зависимость от страницы, чтобы при смене страницы функция обновлялась

  // Функция для загрузки дополнительных кандидатов
  const loadMoreCandidates = async () => {
    if (isLoading || !hasMore) return;  // Если загрузка в процессе или кандидаты закончились, не делаем запрос

    setIsLoading(true);
    setPage((prevPage) => prevPage + 1);  // Переходим на следующую страницу

    try {
      const response = await fetch(`/api/candidates/forAll?page=${page}`);
      const data = await response.json();

      if (response.ok) {
        setCandidates((prevCandidates) => [...prevCandidates, ...data.candidates]);  // Добавляем новых кандидатов к уже загруженным
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
  }, [candidates, loadCandidates]);  // Используем loadCandidates как зависимость

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
