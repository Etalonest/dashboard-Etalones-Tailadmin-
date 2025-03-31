import React from 'react';
import TransferToKurator from '../../TransferToKurator/TransferToKurator';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import { Candidate } from '@/src/types/candidate';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import EventsCandidate from '../../Events/EventsCandidate';
import { Label } from '@/components/ui/label';

const ViewCandidateForm = ({ candidate }: { candidate: Candidate | null }) => {
  console.log("Rendering ViewCandidateForm with candidate:", candidate);
  
  if (!candidate) {
    return <p>Нет данных о кандидате</p>;
  }

  return (
    <div className='grid grid-cols-3 gap-5 mx-auto w-full'>
      <Card className='col-span-2'>
      
        <div className='flex items-center justify-around m-5 w-full'>
        <div className='flex items-center justify-around m-5'>
          <Image src={candidate.avatar || "/images/logo/logo-red.png"} alt="candidate" width={150} height={150} />
        </div>
        <CardHeader className='m-5 flex flex-col gap-5'>
          <div className='bg-slate-200 rounded-md p-2'>
            {candidate.professions.map((profession, index) => (
              <div key={index} className='flex justify-between gap-2'>
                <strong>{profession.name}:</strong><strong>{profession.expirience}</strong>
              </div>
            ))}
          </div>

          {candidate.documents && candidate.documents.length > 0 ? (
            <div className='flex gap-2 bg-slate-200 rounded-md p-2'>
              <p>Документы:</p>
              <div className='flex flex-col gap-2 justify-between'>
                {candidate.documents.map((doc, index) => (
                  <div key={index}>
                    <strong>- {doc.docType}</strong>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p>Документы не указаны</p>
          )}
        </CardHeader>
          </div>
        <CardContent className='flex justify-start m-5 w-full'>
          <div className='flex flex-col gap-2 w-full'>
            <p>Имя: <strong>{candidate.name || "Не указано"}</strong></p>
            <p>Телефон: <strong>{candidate.phone || "Не указано"}</strong></p>

            {candidate.ageNum ? (
              <p>Возраст: <strong>{candidate.ageNum}</strong></p>
            ) : (
              <p>Возраст не указан</p>
            )}

            {candidate.citizenship ? (
              <p>Гражданство: <strong>{candidate.citizenship}</strong></p>
            ) : (
              <p>Гражданство не указано</p>
            )}
            
            <div>Местоположение: <strong>{candidate.locations || "Не указано"}</strong></div>

            {candidate.langue && candidate.langue.length > 0 ? (
              <div className='flex gap-2'>
                Языки:
                {candidate.langue.map((lang, index) => (
                  lang && lang.name ? (
                    <div key={index}>
                      <strong>{lang.name}</strong>
                    </div>
                  ) : null
                ))}
              </div>
            ) : (
              <p>Языки не указаны</p>
            )}

            {candidate.drivePermis.length > 0 ? (
              <div className='flex gap-2'>
                Водительское удостоверение:
                {candidate.drivePermis.map((perm, index) => (
                  <div key={index}>
                    <strong>{perm}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <p>Водительское удостоверение не указано</p>
            )}

            {candidate.cardNumber ? (
              <p>Номер карты: <strong>{candidate.cardNumber}</strong></p>
            ) : (
              <p>Номер карты не указан</p>
            )}

            {candidate?.stages?.stage}


{candidate.comment && candidate.comment.length > 0 ? (
  <div>
    <p>Комментарии:</p>
    <ScrollArea className='h-50'>
      {candidate.comment.map((com: any, index) => (
        <div
          key={index}
          className="relative flex flex-col gap-2 items-start rounded-md border px-4 py-2 font-mono text-sm shadow-sm"
        >
          <div className="flex justify-between w-full">
            <div className="flex gap-2 items-center">
              <Badge>
                {new Date(com.date)
                  .toLocaleString()
                  .slice(0, 5)}.
                {new Date(com.date)
                  .getFullYear()
                  .toString()
                  .slice(-2)}
              </Badge>
              <Badge className='text-green-700'>
                {new Date(com.date)
                  .toLocaleString()
                  .slice(12, 17)}
              </Badge>
            </div>
            <span className="text-xs font-semibold text-gray-500">
              Автор: {com.author}
            </span>
          </div>
          <p className="text-sm">{com.text}</p>
        </div>
      ))}
    </ScrollArea>
  </div>
) : (
  <p>Комментарии не указаны</p>
)}


            {candidate.invoices && candidate.invoices.length > 0 ? (
              <div>
                <p>Счета:</p>
                {candidate.invoices.map((invoice, index) => (
                  <div key={index}>
                    <strong>{invoice || "Не указано"}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <p>Счета не указаны</p>
            )}

            {candidate.tasks && candidate.tasks.length > 0 ? (
              <div>
                <p>Задачи:</p>
                {candidate.tasks.map((task, index) => (
                  <div key={index}>
                    <strong>{task || "Не указано"}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <p>Задачи не указаны</p>
            )}
          </div>
          
        </CardContent>
        <div className='w-full'>
            <Label className='text-xl font-bold my-2'>События</Label>
        <EventsCandidate candidate={candidate} /></div>
        <CardFooter className='flex flex-col justify-center items-end'>
          <div>Куратор: <strong>{candidate?.manager?.name || "Не указан"}</strong></div>
          <div>Контракт: <strong>{candidate?.manager?.phone || "Не указан"}</strong></div>
        </CardFooter>
      </Card>
      
      <TransferToKurator className='col-span-1' candidate={candidate} selectedProfessions={candidate?.professions.map((prof) => prof.name)} />
    </div>
  );
};

export default ViewCandidateForm;
