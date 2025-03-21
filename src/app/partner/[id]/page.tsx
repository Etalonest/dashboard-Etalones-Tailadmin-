'use client';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
import { Download } from 'lucide-react';
import { useParams } from "next/navigation";

const PartnerPage = () => {
  const { id } = useParams();  
  console.log("PARTNERID", id);  // Логируем ID партнёра для проверки

  const [partner, setPartner] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartner = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/partner/${id}`);
        if (!response.ok) {
          throw new Error('Ошибка при загрузке данных кандидата');
        }
        const data = await response.json();
        console.log("Data from API:", data); // Логируем данные, которые приходят от API
        setPartner(data.partner);  // Используем `data.partner`, если в ответе приходит объект partner
      } catch (error: any) {
        console.error('Ошибка при запросе данных кандидата:', error);
        setError('Ошибка при загрузке данных кандидата'); // Устанавливаем ошибку в состояние
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPartner();
    }
  }, [id]);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>{error}</div>; // Отображаем ошибку, если она произошла
  }

  if (!partner) {
    return <div>Партнёр не найден</div>;
  }

  return (
    <div className='grid grid-cols-2 gap-5 mx-auto'>
      <Card className='col-span-1'>
        <div className='flex items-center justify-around m-5'>
          <Image src={partner?.avatar || "/images/logo/logo-red.png"} alt="partner" width={150} height={150} />
          <CardHeader className='m-5 flex flex-col gap-5'>
            <div>
              <p>Тип контракта: <strong>{partner?.contract?.typeC}</strong></p>
              <p>Сумма контракта: <strong>{partner?.contract?.sum}</strong></p>
              <div className='flex justify-between items-center'>
                <div className='flex gap-2 justify-start items-center '>
                  <p>Подписан</p>
                  <Checkbox />
                </div>
                <Download size={18} />
              </div>
            </div>
            <div className='bg-slate-200 rounded-md p-2'>
              {partner?.professions?.map((profession: any, index: number) => (
                <div key={index} className='flex justify-between gap-2'>
                  <strong>- {profession?.name}</strong>
                </div>
              ))}
            </div>
          </CardHeader>
        </div>
        <CardContent className='flex justify-start m-5'>
          <div className='flex flex-col gap-2'>
            <p>Имя: <strong>{partner?.name}</strong></p>
            <p>Телефон: <strong>{partner?.phone}</strong></p>
            <p>Местоположение: <strong>{partner?.location}</strong></p>
            <div className='grid grid-cols-2 gap-15 mt-2'>
              {partner?.professions?.map((prof: any, index: number) => (
                <div key={index} className='flex flex-col gap-2 bg-slate-100 p-4 rounded-md'>
                  <strong>{prof?.name}</strong>
                  <p>- {prof?.location}</p>
                  <p>- {prof?.salary}</p>
                  <p>- {prof?.workHours}</p>
                  {prof?.pDocs && prof.pDocs.length > 0 && (
                    <div>
                      <span>Документы:</span>
                      {prof.pDocs.map((doc: any, index: number) => (
                        <div key={index}>
                          <strong>{doc}</strong>
                        </div>
                      ))}
                    </div>
                  )}
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
    </div>
  );
};

export default PartnerPage;
