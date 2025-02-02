import React, { createContext, useContext, useState, useEffect } from 'react';

// Тип данных кандидата
interface Candidate {
  map(arg0: (candidate: import("../types/candidate").Candidate, index: number) => React.JSX.Element): React.ReactNode;
  filter: any;
  length: number;
  _id: string;
  name: string;
  dialogs: any[];  
}

interface CandidateContextType {
  candidates: Candidate | null;
  setCandidates: React.Dispatch<React.SetStateAction<Candidate | null>>;
  fetchCandidates: (candidateId: string) => void;
}

const CandidateContext = createContext<CandidateContextType | undefined>(undefined);

export const CandidateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [candidates, setCandidates] = useState<Candidate | null>(null);

  const fetchCandidates = async (candidateId: string) => {
    try {
      const response = await fetch(`/api/candidates/${candidateId}`);
      if (!response.ok) {
        throw new Error('Не удалось загрузить данные кандидата');
      }
      const data = await response.json();
      setCandidates(data);
    } catch (error) {
      console.error('Ошибка при загрузке кандидата:', error);
    }
  };

  return (
    <CandidateContext.Provider value={{ candidates, setCandidates, fetchCandidates }}>
      {children}
    </CandidateContext.Provider>
  );
};

export const useCandidates = (): CandidateContextType => {
  const context = useContext(CandidateContext);
  if (!context) {
    throw new Error('useCandidate должен использоваться внутри CandidateProvider');
  }
  return context;
};
