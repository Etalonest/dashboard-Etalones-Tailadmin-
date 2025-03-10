'use client'
import { useEffect, useState, useRef } from 'react';
import { Button } from "@/components/ui/button";

interface WorkUpChoiseProps {
  onStatusesChange: (statuses: string[]) => void;
  initialSelectedStatuses?: any[]; 
}

export const WorkUpChoise: React.FC<WorkUpChoiseProps> = ({ onStatusesChange, initialSelectedStatuses = [] }) => {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  // Хранение предыдущего значения initialSelectedStatuses для предотвращения бесконечных обновлений
  const prevInitialSelectedStatuses = useRef<{ name: string; _id: string }[]>([]);

  // Маппинг ключей статусов на их отображаемые названия
  const statusesNamesMap: { [key: string]: string } = {
    Home: 'Находится дома',
    UrgentWork: 'Срочно нужна работа',
    WantsToChangeJob: 'Хочет поменять работу',
    SearchingBeforeLeaving: 'Ищет перед выездом',
    InPoland: 'В Польше',
    InGermany: 'В Германии',
    OnlyInOwnCity: 'Только в своём городе',
    Invitation: 'Отправленно приглашение',
    OnObject: 'На объекте',
    NoVacancy: 'Нет подходящей вакансии',
    CheckWork: 'Ждёт работу',

  };
  const statusColorText: { [key: string]: string } = {
    Home: 'text-black',
    UrgentWork: 'text-white',
    WantsToChangeJob: 'text-black',
    SearchingBeforeLeaving: 'text-black',
    InPoland: 'text-black',
    InGermany: 'text-black',
    OnlyInOwnCity: 'text-black',
    Invitation: 'text-black',
    OnObject: 'text-black',
    NoVacancy: 'text-black',
    CheckWork: 'text-black',
  };
  const statusColorMap: { [key: string]: string } = {
    Home: 'bg-yellow-100',
    UrgentWork: 'bg-red-800',
    WantsToChangeJob: 'bg-yellow-100',
    SearchingBeforeLeaving: 'bg-yellow-100',
    InPoland: 'bg-green-200',
    InGermany: 'bg-green-200',
    OnlyInOwnCity: 'bg-yellow-100',
    Invitation: 'bg-yellow-100',
    OnObject: 'bg-yellow-100',
    NoVacancy: 'bg-yellow-100',
    CheckWork: 'bg-yellow-100',
  };
  // Эффект для синхронизации с initialSelectedStatuses
  useEffect(() => {
    // Сравниваем начальные значения с предыдущими
    if (initialSelectedStatuses.length !== prevInitialSelectedStatuses.current.length || 
        initialSelectedStatuses.some((status, idx) => status.name !== prevInitialSelectedStatuses.current[idx].name)) {
      setSelectedStatuses(initialSelectedStatuses.map(status => status.name)); // Сохраняем только имена статусов
      prevInitialSelectedStatuses.current = initialSelectedStatuses;
    }
  }, [initialSelectedStatuses]);

  // Хэндлер для обработки кликов по кнопкам
  const handleButtonClick = (statusKey: string) => {
    let updatedStatuses: string[];

    // Если статус уже выбран, убираем его, иначе добавляем
    if (selectedStatuses.includes(statusKey)) {
      updatedStatuses = selectedStatuses.filter(status => status !== statusKey);
    } else {
      updatedStatuses = [...selectedStatuses, statusKey];
    }

    setSelectedStatuses(updatedStatuses);
    onStatusesChange(updatedStatuses); 
  };

  return (
    <div className="flex flex-wrap gap-1 h-max">
      {Object.entries(statusesNamesMap).map(([statusKey, statusName]) => (
        <Button
          key={statusKey}
          type="button"
          variant="outline"
          className={`hover:bg-gray-300 text-black ${selectedStatuses.includes(statusName) ? `${statusColorMap[statusKey]} ${statusColorText[statusKey]} ` : ""}`}          onClick={() => handleButtonClick(statusName)} 
        >
          {statusName}
        </Button>
      ))}
    </div>
  );
};
