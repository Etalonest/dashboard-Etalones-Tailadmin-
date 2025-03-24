'use client';

import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, UserCog } from 'lucide-react';

const PExx = () => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedCandidates, setParsedCandidates] = useState<any[]>([]); // Для хранения парсенных данных
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false); // Для отображения превью

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handlePreview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/pEx', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file.');
      }

      const data = await response.json();

      if (data.previewData && Array.isArray(data.previewData)) {
        setParsedCandidates(data.previewData); // Сохраняем данные кандидатов
        setIsPreview(true); // Включаем режим предварительного просмотра
      } else {
        setError('Failed to parse data from the file.');
      }
    } catch (error: any) {
      setError(error.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  // Функция для поиска кандидата по номеру телефона и возврата самого объекта
  const findDuplicateCandidate = (phone: string) => {
    return parsedCandidates.find(
      (candidate: any) => candidate['контактный номер или ник в телеграм'] === phone
    );
  };

  // Фильтрация уникальных кандидатов (без дублей)
  const getUniqueCandidates = () => {
    return parsedCandidates.filter((candidate: any) => {
      const duplicate = findDuplicateCandidate(candidate['контактный номер или ник в телеграм']);
      return !duplicate || duplicate === candidate; // Возвращаем только тех кандидатов, у которых нет дублей
    });
  };

  // Обработка сохранения уникальных кандидатов
  const handleSaveUnique = async () => {
    const uniqueCandidates = getUniqueCandidates();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/pEx', {
        method: 'POST',
        body: JSON.stringify(uniqueCandidates), // Отправляем только уникальных кандидатов
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to save unique candidates.');
      }

      const data = await response.json();
      setParsedCandidates(data.data); // Сохраняем успешных кандидатов в parsedCandidates

      alert('Unique candidates saved successfully!');
    } catch (error: any) {
      setError(error.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Upload Excel File</h1>
      <form onSubmit={handlePreview}>
        <input type="file" accept=".xlsx" onChange={handleFileChange} />
        <button type="submit" disabled={loading}>
          Preview
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Loading...</p>}

      {/* Показываем таблицу с данными для предварительного просмотра */}
      {isPreview && parsedCandidates && Array.isArray(parsedCandidates) && parsedCandidates.length > 0 && (
        <div>
          <Table>
            <TableHeader className="border-b py-2">
              <TableRow>
                <TableHead><strong>Добавлен</strong></TableHead>
                <TableHead><strong>Имя</strong></TableHead>
                <TableHead><strong>Телефон</strong></TableHead>
                <TableHead><strong>Профессия</strong></TableHead>
                <TableHead><strong>Статус</strong></TableHead>
                <TableHead><strong>Документы</strong></TableHead>
                <TableHead><strong>Диалоги</strong></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parsedCandidates.map((candidate, index) => {
                const duplicate = findDuplicateCandidate(candidate['контактный номер или ник в телеграм']);
                return (
                  <TableRow key={index}>
                    <TableCell className="flex flex-col">
                      <div>{new Date(candidate.createdAt).toLocaleString().slice(0, 10)}</div>
                      <div>{candidate?.manager?.name}</div>
                    </TableCell>
                    <TableCell>
  {/* Если дубликат найден, показываем информацию о нем, если нет, показываем нового кандидата */}
  {duplicate ? (
    <div>
      <div>
        <strong>Existing Candidate:</strong>
      </div>
      <p>{duplicate['Имя']}</p> {/* Показываем имя существующего кандидата */}
      <div>{duplicate['контактный номер или ник в телеграм']}</div> {/* Показываем телефон существующего кандидата */}
      <div className="flex gap-2">
        <Eye size={18} />
        <UserCog size={18} />
      </div>
    </div>
  ) : (
    <div>
      <strong>New Candidate:</strong>
      <p>{candidate.name}</p> {/* Показываем имя нового кандидата */}
      <div>{candidate['контактный номер или ник в телеграм']}</div> {/* Показываем телефон нового кандидата */}
      <div className="flex gap-2">
        <Eye size={18} />
        <UserCog size={18} />
      </div>
    </div>
  )}
</TableCell>

                    <TableCell>{candidate['контактный номер или ник в телеграм']}</TableCell>
                    <TableCell>
                      {/* Тут можно добавить отображение профессии */}
                    </TableCell>
                    <TableCell>
                      {duplicate ? (
                        <span style={{ color: 'red' }}>Duplicate</span>
                      ) : (
                        <span style={{ color: 'green' }}>Unique</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <button onClick={handleSaveUnique} disabled={loading}>
            Save Unique Candidates
          </button>
        </div>
      )}
    </div>
  );
};

export default PExx;
