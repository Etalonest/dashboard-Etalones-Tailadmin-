import React from 'react';
import SuitableV from '../../SuitableV/SuitableV';

interface Candidate {
  name: string;
  phone: string;
  professions: { name: string }[];
  // добавьте другие поля, которые вам нужны
}

const ViewCandidateForm = ({ candidate }: { candidate: Candidate | null }) => {

  // Проверка на null
  if (!candidate) {
    return <p>Нет данных о кандидате</p>;
  }

  return (
    <div className='grid grid-cols-2 gap-5'>
        
      <div>
      <h2>Просмотр кандидата</h2>
      <p><strong>Имя:</strong> {candidate.name}</p>
      <p><strong>Телефон:</strong> {candidate.phone}</p>
      <p><strong>Профессии:</strong> {candidate.professions.map((profession, index) => (
        <span key={index}>{profession.name}{index < candidate.professions.length - 1 ? ', ' : ''}</span>
      ))}</p>
      </div>
      <SuitableV selectedProfessions={candidate?.professions.map((prof) => prof.name)}/>
    </div>
  );
};

export default ViewCandidateForm;
