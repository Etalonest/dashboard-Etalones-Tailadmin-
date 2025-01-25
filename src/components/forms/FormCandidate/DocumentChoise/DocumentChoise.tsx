'use client'
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";

interface DocumentChoiseProps {
  onDocumentsChange: (documents: string[]) => void; 
  initialSelectedDocuments?: any[];  // Типизируем как массив объектов с полями docType и другими данными
}

export const DocumentChoise: React.FC<DocumentChoiseProps> = ({ onDocumentsChange, initialSelectedDocuments = []  }) => {
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  // Маппинг названий документов на их ключи
  const documentNamesMap: { [key: string]: string } = {
    Visa: 'Виза',
    Invitation: 'Приглашение',
    ResidenceCard: 'Карта побыту',
    Pessel: 'Пессель',
    EUPassport: 'Паспорт ЕС',
    Par24: 'Параграф 24',
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
    onDocumentsChange(updatedDocuments); // Передаем обновленный массив в родительский компонент
  };

  // Эффект для синхронизации с initialSelectedDocuments
  useEffect(() => {
    // Извлекаем только docType из initialSelectedDocuments и устанавливаем их в selectedDocuments
    const initialDocs = initialSelectedDocuments.map(doc => doc.docType);
    setSelectedDocuments(initialDocs);
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
    </div>
  );
};
