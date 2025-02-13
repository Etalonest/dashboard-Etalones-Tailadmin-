'use client'
import { useEffect, useState, useRef } from 'react';
import { Button } from "@/components/ui/button";

interface WorkUpChoiseProps {
  onStatusesChange: (statuses: string[]) => void;
  initialSelectedStatuses?: any[]; 
}

export const WorkUpChoise: React.FC<WorkUpChoiseProps> = ({ onStatusesChange, initialSelectedStatuses = [] }) => {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const prevInitialSelectedStatuses = useRef<{ name: string; _id: string }[]>([]);
  const statusesNamesMap: { [key: string]: string } = {
    NoObj: 'Нет объекта',
    WaitContract: 'Подписывает контракт с немцем',
    Doubtful: 'Сомневается в законности',
    LowContract: 'Хочет низкий контракт',
    AnotherCompany: 'Работает с другой фирмой',
    Ready: 'Готов работать с нами',
    WaitPeople: 'Ждёт людей',
    BadCall: "Тяжело выходит на связь"
  };
  const statusColorText: { [key: string]: string } = {
    NoObj: 'text-black',
    WaitContract: 'text-white',
    Doubtful: 'text-black',
    LowContract: 'text-black',
    AnotherCompany: 'text-black',
    Ready: 'text-black',
    WaitPeople: 'text-black',
    BadCall: 'text-white'
  };
  const statusColorMap: { [key: string]: string } = {
    NoObj: 'bg-red-100',
    WaitContract: 'bg-yellow-400',
    Doubtful: 'bg-red-100',
    LowContract: 'bg-yellow-100',
    AnotherCompany: 'bg-yellow-200',
    Ready: 'bg-green-200',
    WaitPeople: 'bg-yellow-100',
    BadCall: 'bg-red-400'
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
    <div className="flex flex-wrap gap-1">
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
