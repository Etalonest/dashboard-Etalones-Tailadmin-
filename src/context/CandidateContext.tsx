import React, { createContext, useContext, useState, useEffect } from 'react';

// Тип данных кандидата
interface Candidate {
  _id: string;
  name: string;
  dialogs: any[];  
}

interface CandidateContextType {
  candidate: Candidate | null;
  setCandidate: React.Dispatch<React.SetStateAction<Candidate | null>>;
  fetchCandidate: (candidateId: string) => void;
}

const CandidateContext = createContext<CandidateContextType | undefined>(undefined);

export const CandidateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [candidate, setCandidate] = useState<Candidate | null>(null);

  const fetchCandidate = async (candidateId: string) => {
    try {
      const response = await fetch(`/api/candidates/${candidateId}`);
      if (!response.ok) {
        throw new Error('Не удалось загрузить данные кандидата');
      }
      const data = await response.json();
      setCandidate(data);
    } catch (error) {
      console.error('Ошибка при загрузке кандидата:', error);
    }
  };

  return (
    <CandidateContext.Provider value={{ candidate, setCandidate, fetchCandidate }}>
      {children}
    </CandidateContext.Provider>
  );
};

export const useCandidate = (): CandidateContextType => {
  const context = useContext(CandidateContext);
  if (!context) {
    throw new Error('useCandidate должен использоваться внутри CandidateProvider');
  }
  return context;
};
