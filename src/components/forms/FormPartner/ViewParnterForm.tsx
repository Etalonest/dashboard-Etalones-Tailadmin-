import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import React from 'react';
import Image from 'next/image';
import { Partner } from '@/src/types/partner';
import { Checkbox } from '@/components/ui/checkbox';
import { Download } from 'lucide-react';


const ViewParnterForm = ({ partner }: { partner: Partner | null }) => {

  console.log("PARTNER",partner);
  if (!partner) {
    return <p>Нет данных о партнёре</p>;
  }

  return (
   
    <Card className='m-10'>
      <div className='flex items-center justify-around p-5'>
      <Image src={partner?.avatar ||"/images/logo/logo-red.png"} alt="partner" width={150} height={150} className='p-5' />
      <CardHeader className='m-5 flex flex-col gap-5'>
        <div>
          <p>Тип контракта: <strong>{partner?.contract?.typeC}</strong></p>
          <p>Сумма контракта: <strong>{partner?.contract?.sum}</strong></p>
          <div className='flex justify-between items-center'>
          <div className='flex gap-2 justify-start items-center '>
          <p>Подписан</p>
          <Checkbox/>
          </div>  
          <Download size={18} />
          </div>
          
        </div>
      {/* <div className='bg-slate-200 rounded-md p-2'>
           {partner?.professions.map((profession, index) => (
            <div key={index} className='flex justify-between gap-2'>
            <strong >- {profession?.name}</strong>
            </div>
        ))}</div> */}
      </CardHeader>
        </div>
        <CardContent className='flex justify-start m-5'>
          <div className=' flex flex-col gap-2'>
          <p>Имя: <strong>{partner?.name}</strong></p>
          <p>Телефон: <strong>{partner?.phone}</strong></p>
          <p>Местоположение: <strong>{partner?.location}</strong></p>
          <div className='grid grid-cols-2  gap-15 mt-2'>
          {partner.professions?.map((prof, index) => (
  prof?.vacancy ? (  // Проверяем, есть ли объект vacancy
    <div key={index}>
      <p>Профессия: {prof?.vacancy?.title}</p>
      <p>Город: {prof?.vacancy?.location}</p>
      <p><span className='font-semibold'>{prof?.vacancy?.place}</span> свободных мест(а)</p>
    </div>
  ) : null 
))}


          </div>
          </div>
           
        </CardContent>
        <CardFooter className='flex flex-col justify-center items-end'>
          <div>Менеджер: <strong>{partner?.manager?.name}</strong></div>
          <div>Контракт: <strong>{partner?.manager?.phone}</strong></div>
        </CardFooter>
    </Card>

      
  );
};

export default ViewParnterForm;
