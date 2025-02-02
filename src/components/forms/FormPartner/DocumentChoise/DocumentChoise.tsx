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

  const documentNamesMap: { [key: string]: string } = {
    Requisites: 'Реквизиты',
    Contract: 'Контракт',
    Bank: 'Банковские данные',
    
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
        className={`hover:bg-gray-300 text-black ${selectedDocuments.includes("Реквизиты") ? "bg-green-800 text-white" : ""}`}
        onClick={() => handleButtonClick("Реквизиты")}
      >
        Реквизиты
      </Button>

      <Button
        type="button"
        variant="outline"
        className={`hover:bg-gray-300 text-black ${selectedDocuments.includes("Контракт") ? "bg-green-800 text-white" : ""}`}
        onClick={() => handleButtonClick("Контракт")}
      >
        Контракт
      </Button>

      <Button
        type="button"
        variant="outline"
        className={`hover:bg-gray-300 text-black ${selectedDocuments.includes("Банковские данные") ? "bg-green-800 text-white" : ""}`}
        onClick={() => handleButtonClick("Банковские данные")}
      >
        Банковские данные
      </Button>
    </div>
  );
};
