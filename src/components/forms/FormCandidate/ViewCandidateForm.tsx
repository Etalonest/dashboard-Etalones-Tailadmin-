import React from 'react';
import TransferToKurator from '../../TransferToKurator/TransferToKurator';

interface Candidate {
  name: string;
  phone: string;
  professions: { name: string }[];
  // добавьте другие поля, которые вам нужны
}

const ViewCandidateForm = ({ candidate, onSubmitSuccess }: { candidate: Candidate | null, onSubmitSuccess: any }) => {

  // Проверка на null
  if (!candidate) {
    return <p>Нет данных о кандидате</p>;
  }

  return (
    <div className='grid grid-cols-3 gap-5'>
        
      <div className='col-span-2'>
      <h2>Просмотр кандидата</h2>
      <p><strong>Имя:</strong> {candidate.name}</p>
      <p><strong>Телефон:</strong> {candidate.phone}</p>
      <p><strong>Профессии:</strong> {candidate.professions.map((profession, index) => (
        <span key={index}>{profession.name}{index < candidate.professions.length - 1 ? ', ' : ''}</span>
      ))}</p>
      </div>
      <TransferToKurator candidate={candidate} selectedProfessions={candidate?.professions.map((prof) => prof.name)}/>
    </div>
  );
};

export default ViewCandidateForm;
