import React from 'react';
import TransferToKurator from '../../TransferToKurator/TransferToKurator';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import { Candidate } from '@/src/types/candidate';
import { p } from 'framer-motion/client';


const ViewCandidateForm = ({ candidate, onSubmitSuccess }: { candidate: Candidate | null, onSubmitSuccess: any }) => {

  if (!candidate) {
    return <p>Нет данных о кандидате</p>;
  }

  return (
    <div className='grid grid-cols-2 gap-5 mx-auto'>
    <Card className='col-span-1'>
      <div className='flex items-center justify-around m-5'>
<Image src={candidate.avatar ||"/images/logo/logo-red.png"} alt="candidate" width={150} height={150} />
      <CardHeader className='m-5 flex flex-col gap-5'>
      <div className='bg-slate-200 rounded-md p-2'>
           {candidate.professions.map((profession, index) => (
            <div key={index} className='flex justify-between gap-2'>
            <strong >{profession.name}:</strong><strong>{profession.expirience}</strong>
            </div>
        ))}</div>
        <div className='flex gap-2 bg-slate-200 rounded-md p-2'>
            <p>Документы:</p>
            <div className='flex flex-col gap-2 justify-between'> 
              {candidate.documents.map((doc, index) => 
            <div key={index} >
              <strong>- {doc.docType}</strong>
            </div>)}</div>
            </div>
      </CardHeader>
        </div>
        <CardContent className='flex justify-start m-5'>
          <div className=' flex flex-col gap-2'>
          <p>Имя: <strong>{candidate.name}</strong></p>
          <p>Телефон: <strong>{candidate.phone}</strong></p>
            <p>Возраст: <strong>{candidate.ageNum}</strong></p>
            <p>Гражданство: <strong>{candidate.citizenship}</strong></p>
            <p>Местоположение: <strong>{candidate.locations}</strong></p>
            <div className='flex gap-2'>Языки: {candidate.langue.map((lang,index) => 
             <div key={index}>
              <strong>{lang.name}</strong>
             </div>
             )}</div>
            <div className='flex gap-2'>Водительское удостоверение: {candidate.drivePermis.map((perm,index) => 
             <div key={index}>
              <strong>{perm}</strong>
             </div>
            )}</div>
            </div>
           
        </CardContent>
        <CardFooter className='flex flex-col justify-center items-end'>
          <div>Куратор: <strong>{candidate?.manager?.name}</strong></div>
          <div>Контракт: <strong>{candidate?.manager?.phone}</strong></div>
        </CardFooter>
    </Card>
    <TransferToKurator candidate={candidate} selectedProfessions={candidate?.professions.map((prof) => prof.name)}/>

      </div>
  );
};

export default ViewCandidateForm;
