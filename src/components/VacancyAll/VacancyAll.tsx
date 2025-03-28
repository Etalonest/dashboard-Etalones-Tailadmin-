'use client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { HandCoins, HousePlus, MapPinned } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import SidebarRight from '../SidebarRight';
import { VacancyType } from '@/src/types/vacancy';
import { useSidebar } from '@/src/context/SidebarContext';

export const VacancyAll: React.FC = () => {
  const {
    selectedVacancy,
    setSidebarROpen,
    setFormType,
    setSelectedVacancy,
  } = useSidebar();

  // Состояние для хранения списка вакансий
  const [vacancies, setVacancies] = useState<VacancyType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/vacancy');
        if (!response.ok) {
          throw new Error('Failed to fetch vacancy');
        }

        const data: VacancyType[] = await response.json();
        setVacancies(data); // Обновляем список вакансий
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []); // Зависимость пустая, чтобы загрузить данные только при монтировании компонента

  const toggleSidebar = (type: 'viewVacancy', vacancy?: VacancyType) => {
    setFormType(type);
    setSelectedVacancy(vacancy || null);
    setSidebarROpen(true);
    console.log("Selected Vacancy: ", vacancy); // Добавьте лог для отладки
  };
  

  return (
    <div>
      <SidebarRight />

      <h1>Все вакансии</h1>

      {/* Если вакансии есть, показываем их */}
      {vacancies.length > 0 ? (
        vacancies.map((vacancy, index) => (
          <Card
            className="rounded-md p-2 w-full cursor-pointer flex justify-center items-center"
            key={index}
            onClick={() => toggleSidebar('viewVacancy', vacancy)}
          >
            <CardHeader>
              <Image
                src={vacancy?.imageFB || '/images/logo/logo-red.png'}
                alt="Logo"
                width={400}
                height={400}
              />
            </CardHeader>
            <CardContent className="w-full">
              <div className="text-xl font-bold">{vacancy.title}</div>
              <div className="text-sm text-gray-600 flex gap-2 items-center">
                <span>
                  <MapPinned />
                </span>
                <span>{vacancy.location}</span>
              </div>
              <div className="flex gap-2 items-center justify-start">
                <HandCoins />
                <span className="font-bold">{vacancy.salary}</span>
                <span className="text-sm text-gray-600">НЕТТО</span>
              </div>
              <div className="flex gap-2 items-center justify-start">
                <HousePlus />
                <span className="font-bold">{vacancy.homePrice}</span>
              </div>
            </CardContent>
            <div className="flex flex-col justify-center items-end w-full">
              <div>Свободных мест: {vacancy.place}</div>
              {vacancy.interviews.length > 0 && (
                <div>
                  На собеседовании:{' '}
                  {vacancy.interviews?.map((interview, index) => (
                    <div key={index}>{interview.name}</div>
                  ))}
                </div>
              )}
              <div className="flex gap-2 items-center justify-end">
                <span className="text-sm font-semibold">Куратор:</span>
                <span className="text-sm">{vacancy.manager?.name}</span>
              </div>
            </div>
          </Card>
        ))
      ) : (
        <p>Вакансии не найдены</p>
      )}
    </div>
  );
};
