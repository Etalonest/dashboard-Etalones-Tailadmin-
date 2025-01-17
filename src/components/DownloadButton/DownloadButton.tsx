import { Save } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const DownloadButton = ({ data }: { data: any }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Функция для скачивания файла
  const downloadFile = async (fileId: string, fileName: string) => {
    setLoading(true);
    setError(null); // Сбрасываем ошибку перед загрузкой
    try {
      const response = await fetch(`/api/download/${fileId}`, { method: 'GET' });

      if (response.ok) {
        // Получаем файл в виде бинарных данных
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName; // Задаём имя файла для скачивания
        document.body.appendChild(a);
        a.click();
        a.remove(); // Убираем элемент после скачивания
      } else {
        throw new Error("Ошибка при скачивании файла");
      }
    } catch (error) {
      setError("Не удалось скачать файл");
    } finally {
      setLoading(false);
    }
  };

  const isButtonDisabled = loading;

  if (loading) {
    return <p>Загрузка...</p>;
  }

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>} {/* Показываем ошибку, если она возникла */}
      <button
        onClick={() => data && downloadFile(data._id, data.name)} // Используем данные для скачивания
        disabled={isButtonDisabled}
        className="flex items-center justify-center px-4 py-2 text-black rounded"
      >
        <Save className="w-6 h-6" />
      </button>
    </div>
  );
};

export default DownloadButton;
