import { useState } from 'react';
import { Button } from "@/components/ui/button";

interface WorkUpChoiseProps {
  onStatusesChange: (statuses: string[]) => void;
}

export const WorkUpChoise: React.FC<WorkUpChoiseProps> = ({ onStatusesChange }) => {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const handleButtonClick = (statusName: string) => {
    let updatedStatuses: string[];

    if (selectedStatuses.includes(statusName)) {
      updatedStatuses = selectedStatuses.filter(status => status !== statusName);
    } else {
      updatedStatuses = [...selectedStatuses, statusName];
    }

    setSelectedStatuses(updatedStatuses);
    onStatusesChange(updatedStatuses);  // Передаем массив строк в родительский компонент
  };

  return (
    <div className="flex flex-wrap gap-1">
      <Button
        type="button"
        variant="outline"
        className={`hover:bg-yellow-100 text-black ${selectedStatuses.includes("Находится дома") ? "bg-yellow-200 text-black" : ""}`}
        onClick={() => handleButtonClick("Находится дома")}
      >
        Находится дома
      </Button>
      <Button
        type="button"
        variant="outline"
        className={`hover:bg-red-300 text-black ${selectedStatuses.includes("Срочно нужна работа") ? "bg-red-800 text-white" : ""}`}
        onClick={() => handleButtonClick("Срочно нужна работа")}
      >
        Срочно нужна работа
      </Button>
      <Button
        type="button"
        variant="outline"
        className={`hover:bg-gray-300 text-black ${selectedStatuses.includes("Хочет поменять работу") ? "bg-green-800 text-white" : ""}`}
        onClick={() => handleButtonClick("Хочет поменять работу")}
      >
        Хочет поменять работу
      </Button>
      <Button
        type="button"
        variant="outline"
        className={`hover:bg-gray-300 text-black ${selectedStatuses.includes("Ищет перед выездом") ? "bg-green-800 text-white" : ""}`}
        onClick={() => handleButtonClick("Ищет перед выездом")}
      >
        Ищет перед выездом
      </Button>
      <Button
        type="button"
        variant="outline"
        className={`hover:bg-gray-300 text-black ${selectedStatuses.includes("В Польше") ? "bg-green-800 text-white" : ""}`}
        onClick={() => handleButtonClick("В Польше")}
      >
        В Польше
      </Button>
      <Button
        type="button"
        variant="outline"
        className={`hover:bg-gray-300 text-black ${selectedStatuses.includes("В Германии") ? "bg-green-800 text-white" : ""}`}
        onClick={() => handleButtonClick("В Германии")}
      >
        В Германии
      </Button>
      <Button
        type="button"
        variant="outline"
        className={`hover:bg-gray-300 text-black ${selectedStatuses.includes("Только в своём городе") ? "bg-green-800 text-white" : ""}`}
        onClick={() => handleButtonClick("Только в своём городе")}
      >
        Только в своём городе
      </Button>
    </div>
  );
};
