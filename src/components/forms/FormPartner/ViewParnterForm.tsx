import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import React from 'react';
import TransferToKurator from '../../TransferToKurator/TransferToKurator';
import Image from 'next/image';
import { Partner } from '@/src/types/partner';
import { Checkbox } from '@/components/ui/checkbox';
import { Download } from 'lucide-react';


const ViewParnterForm = ({ partner }: { partner: Partner | null }) => {

  console.log("PARTNER",partner);
  if (!partner) {
    return <p>Нет данных о кандидате</p>;
  }

  return (
    <div className='grid grid-cols-2 gap-5 mx-auto'>
    <Card className='col-span-1'>
      <div className='flex items-center justify-around m-5'>
      <Image src={partner.avatar ||"/images/logo/logo-red.png"} alt="partner" width={150} height={150} />
      <CardHeader className='m-5 flex flex-col gap-5'>
        <div>
          <p>Тип контракта: <strong>{partner.contract.typeC}</strong></p>
          <p>Сумма контракта: <strong>{partner.contract.sum}</strong></p>
          <div className='flex justify-between items-center'>
          <div className='flex gap-2 justify-start items-center '>
          <p>Подписан</p>
          <Checkbox/>
          </div>  
          <Download size={18} />
          </div>
          
        </div>
      <div className='bg-slate-200 rounded-md p-2'>
           {partner.professions.map((profession, index) => (
            <div key={index} className='flex justify-between gap-2'>
            <strong >- {profession.name}</strong>
            </div>
        ))}</div>
      </CardHeader>
        </div>
        <CardContent className='flex justify-start m-5'>
          <div className=' flex flex-col gap-2'>
          <p>Имя: <strong>{partner.name}</strong></p>
          <p>Телефон: <strong>{partner.phone}</strong></p>
          <p>Местоположение: <strong>{partner.location}</strong></p>
          <div className='grid grid-cols-2  gap-15 mt-2'>
            {partner?.professions.map((prof, index) => (
              <div key={index} className='flex flex-col gap-2 bg-slate-100 p-4 rounded-md'>
                <strong>{prof?.name}</strong>
                <p>- {prof?.location}</p>
                <p>- {prof?.salary}</p>
                <p>- {prof?.workHours}</p>
                <div>
  {prof?.pDocs && prof.pDocs.length > 0 && (
    <div>
      <span>Документы:</span>
      {prof.pDocs.map((doc: any, index: any) => (
        <div key={index}>
          <strong>{doc}</strong>
        </div>
      ))}
    </div>
  )}
</div>

              </div>
            ))}
          </div>
          </div>
           
        </CardContent>
        <CardFooter className='flex flex-col justify-center items-end'>
          <div>Менеджер: <strong>{partner?.manager?.name}</strong></div>
          <div>Контракт: <strong>{partner?.manager?.phone}</strong></div>
        </CardFooter>
    </Card>
    {/* <TransferToKurator partner={partner} selectedProfessions={partner?.professions.map((prof) => prof.name)}/> */}

      </div>
  );
};

export default ViewParnterForm;
