'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React, { useState } from 'react';

const PEx = () => {
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
      setError('Пожалуйста, выберите файл для загрузки.');
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
        throw new Error('Не удалось загрузить файл.');
      }

      const candidates = await response.json();
      console.log('Ответ от сервера:', candidates);  // Это поможет понять, что приходит от сервера

      if (candidates.previewData && Array.isArray(candidates.previewData)) {
        setParsedCandidates(candidates.previewData); // Сохраняем данные кандидатов
        setIsPreview(true); // Включаем режим предварительного просмотра
      } else {
        setError('Не удалось разобрать данные из файла.');
      }

    } catch (error: any) {
      setError(error.message || 'Что-то пошло не так.');
    } finally {
      setLoading(false);
    }
  };
  const handleSaveUnique = async () => {
    const uniqueCandidates = parsedCandidates.filter((candidate: any) => !candidate.isDuplicate);
    setLoading(true);
    setError(null);
  
    const transformedCandidates = uniqueCandidates.map((candidate: any) => {
      return {
        name: candidate['Имя'],
        phone: candidate['Контактный номер'],
        status: candidate['Статус'] || 'не обработан',  // Если статус отсутствует, ставим 'не обработан'
        professions: candidate['Специальность'],
        source: 'excel',
        note: candidate['Примечание'],  // Примечание
        responsible: candidate['Ответственный'],  // Ответственный
        comment: candidate['Комментарий'],  // Комментарий
        messenger: candidate['Мессенджер'],  // Мессенджер (если нужно)
      };
    });
    
  
    try {
      const response = await fetch('/api/candidates/exel', {
        method: 'POST',
        body: JSON.stringify(transformedCandidates),  // Send transformed data
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Не удалось сохранить уникальных кандидатов.');
      }
  
      const data = await response.json();
      setParsedCandidates(data.data); // Succeeding candidates data
  
      console.log('Уникальные кандидаты успешно сохранены!', data); // Success alert
  
    } catch (error: any) {
      setError(error.message || 'Что-то пошло не так.');
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div>
      <h1>Загрузить файл Excel</h1>
      <form onSubmit={handlePreview}>
        <input type="file" accept=".xlsx" onChange={handleFileChange} />
        <button type="submit" disabled={loading}>Предпросмотр</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Загрузка...</p>}

      {/* Показываем таблицу с данными для предварительного просмотра */}
      {isPreview && parsedCandidates && Array.isArray(parsedCandidates) && parsedCandidates.length > 0 && (
        <div>
          <h2>Предпросмотр разобранных данных</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Имя</TableHead >
                <TableHead >Мессенджер</TableHead > 
                <TableHead >Телефон</TableHead >
                <TableHead >Профессии</TableHead >
                <TableHead >Комментарий</TableHead >
                <TableHead >Менеджер</TableHead >
                <TableHead >Статус</TableHead >
                <TableHead>Комментарий-2</TableHead>
                <TableHead >Проверка на дубликат</TableHead >
              </TableRow>
            </TableHeader>
            <TableBody>
              {parsedCandidates.map((candidate: any, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell className="w-[100px]">{candidate['Имя']}</TableCell>
                    <TableCell>{candidate['Мессенджер']}</TableCell>
                    <TableCell>{candidate['Контактный номер']}</TableCell>
                    <TableCell>
                      {candidate['Специальность'] && Array.isArray(candidate['Специальность'].split(',')) &&
                        candidate['Специальность'].split(',').map((prof: string, idx: number) => (
                          <div key={idx}>{prof.trim()}</div>
                        ))
                      }
                    </TableCell>
                    <TableCell>
                      {candidate['Примечание'] && (
                        <div>
                          <strong>Примечание:</strong> {candidate['Примечание']}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{candidate['Ответственный']}</TableCell>
                    <TableCell>{candidate['Статус']}</TableCell>
                    <TableCell>{candidate['Комментарий']}</TableCell>
                    <TableCell>
                      {/* Если дубликат найден, выводим его информацию */}
                      {candidate.isDuplicate ? (
                        <div>
                          <span style={{ color: 'red' }}>Дубликат</span>
                          <div>
                            <strong>Информация о дубликате:</strong>
                            <div>Имя: {candidate.existingCandidate?.name}</div>
                            <div>Телефон: {candidate.existingCandidate?.phone}</div>
                            <div>Менеджер: {candidate.existingCandidate?.manager?.name}</div>
                            <div>Комментарий: {candidate.existingCandidate?.comment.slice(-1)[0]?.text}</div>
                            </div>
                        </div>
                      ) : (
                        <span style={{ color: 'green' }}>Уникальный</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <button onClick={handleSaveUnique} disabled={loading}>Сохранить уникальных кандидатов</button>
        </div>
      )}
    </div>
  );
};

export default PEx;
