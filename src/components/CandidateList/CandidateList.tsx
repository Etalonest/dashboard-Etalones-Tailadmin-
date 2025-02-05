import React from 'react';
import { useCandidates } from '@/src/context/CandidatesContext';

const CandidatesList = () => {
  const { candidates, isLoading, error } = useCandidates();

  return (
    <div>
      {isLoading && <p>Загрузка...</p>}
      {error && <p style={{ color: 'red' }}>Ошибка: {error}</p>}
      {!isLoading && !error && candidates.length === 0 && <p>Нет кандидатов</p>}
      <ul>
        {candidates.map((candidate) => (
          <li key={candidate.id}>{candidate.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default CandidatesList;
