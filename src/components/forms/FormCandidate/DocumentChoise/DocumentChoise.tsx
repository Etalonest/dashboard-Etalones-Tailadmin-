'use client'
import { useEffect, useState, useRef } from 'react';
import { Button } from "@/components/ui/button";

interface DocumentChoiseProps {
  onDocumentsChange: (documents: string[]) => void;
  initialSelectedDocuments?: any[];
}

export const DocumentChoise: React.FC<DocumentChoiseProps> = ({ onDocumentsChange, initialSelectedDocuments = [] }) => {
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  // Хранение предыдущего значения initialSelectedDocuments
  const prevInitialSelectedDocuments = useRef<any[]>([]);

  // Маппинг названий документов на их ключи
  const documentNamesMap: { [key: string]: string } = {
    Visa: 'Виза',
    Invitation: 'Приглашение',
    ResidenceCard: 'Карта побыту',
    Pessel: 'Пессель',
    EUPassport: 'Паспорт ЕС',
    Par24: 'Параграф 24',
    Bio: 'Биометрия Украина',
    VNJ: 'ВНЖ ЕС',
  };

  // Хэндлер для обработки кликов по кнопкам
  const handleButtonClick = (documentKey: string) => {
    let updatedDocuments: string[];

    // Если документ уже выбран, убираем его, иначе добавляем
    if (selectedDocuments.includes(documentKey)) {
      updatedDocuments = selectedDocuments.filter(doc => doc !== documentKey);
    } else {
      updatedDocuments = [...selectedDocuments, documentKey];
    }

    setSelectedDocuments(updatedDocuments);
    onDocumentsChange(updatedDocuments); 
  };

  // Эффект для синхронизации с initialSelectedDocuments
  useEffect(() => {
    // Только обновляем состояние, если initialSelectedDocuments изменился
    if (JSON.stringify(prevInitialSelectedDocuments.current) !== JSON.stringify(initialSelectedDocuments)) {
      const initialDocs = initialSelectedDocuments.map(doc => doc.docType);
      setSelectedDocuments(initialDocs);
      prevInitialSelectedDocuments.current = initialSelectedDocuments;
    }
  }, [initialSelectedDocuments]);

  return (
    <div className="flex flex-wrap gap-1">
      <Button
        type="button"
        variant="outline"
        className={`hover:bg-gray-300 text-black ${selectedDocuments.includes("Виза") ? "bg-green-800 text-white" : ""}`}
        onClick={() => handleButtonClick("Виза")}
      >
        Виза
      </Button>

      <Button
        type="button"
        variant="outline"
        className={`hover:bg-gray-300 text-black ${selectedDocuments.includes("Приглашение") ? "bg-green-800 text-white" : ""}`}
        onClick={() => handleButtonClick("Приглашение")}
      >
        Приглашение
      </Button>

      <Button
        type="button"
        variant="outline"
        className={`hover:bg-gray-300 text-black ${selectedDocuments.includes("Карта побыту") ? "bg-green-800 text-white" : ""}`}
        onClick={() => handleButtonClick("Карта побыту")}
      >
        Карта побыту
      </Button>

      <Button
        type="button"
        variant="outline"
        className={`hover:bg-gray-300 text-black ${selectedDocuments.includes("Пессель") ? "bg-green-800 text-white" : ""}`}
        onClick={() => handleButtonClick("Пессель")}
      >
        Пессель
      </Button>

      <Button
        type="button"
        variant="outline"
        className={`hover:bg-gray-300 text-black ${selectedDocuments.includes("Паспорт ЕС") ? "bg-green-800 text-white" : ""}`}
        onClick={() => handleButtonClick("Паспорт ЕС")}
      >
        Паспорт ЕС
      </Button>

      <Button
        type="button"
        variant="outline"
        className={`hover:bg-gray-300 text-black ${selectedDocuments.includes("Параграф 24") ? "bg-green-800 text-white" : ""}`}
        onClick={() => handleButtonClick("Параграф 24")}
      >
        Параграф 24
      </Button>
      <Button
        type="button"
        variant="outline"
        className={`hover:bg-gray-300 text-black ${selectedDocuments.includes("Биометрия Украина") ? "bg-green-800 text-white" : ""}`}
        onClick={() => handleButtonClick("Биометрия Украина")}
      >
        Биометрия Украина
      </Button>
      <Button
        type="button"
        variant="outline"
        className={`hover:bg-gray-300 text-black ${selectedDocuments.includes("ВНЖ ЕС") ? "bg-green-800 text-white" : ""}`}
        onClick={() => handleButtonClick("ВНЖ ЕС")}
      >
        ВНЖ ЕС
      </Button>
      
    </div>
  );
};
