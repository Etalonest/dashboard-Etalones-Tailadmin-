'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSession } from "@/src/context/SessionContext";
import React, { useState } from 'react';

const PEx = () => {
  const { session } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [parsedCandidates, setParsedCandidates] = useState<any[]>([]); // Для хранения парсенных данных
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false); // Для отображения превью
  if (session?.managerRole !== 'admin') {
    return null; 
  }
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
        status: 'Не обработан', 
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
        <Label htmlFor="excel">Загрузить файл Excel</Label>
      <form onSubmit={handlePreview}className="flex w-full max-w-sm items-center gap-1.5">
    <Input id="excel" type="file" accept=".xlsx" onChange={handleFileChange} />
    <Button type="submit" disabled={loading}>Предпросмотр</Button>
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
                <TableHead className="w-[100px]"><p>Имя</p><p>Мессенджер</p><p>Телефон</p></TableHead >
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
<TableCell className="w-[100px]">
  <p className="w-[100px] overflow-hidden whitespace-nowrap text-ellipsis">{candidate['Имя']}</p>
  <p>{candidate['Мессенджер']}</p>
  <p>{candidate['Контактный номер']}</p>
</TableCell>
                    <TableCell>
  {typeof candidate['Специальность'] === 'string' && candidate['Специальность'].trim() && (
    candidate['Специальность']
    .split(/[\s,\.]+/)
    .map((prof: string, idx: number) => (
        <div key={idx}>{prof.trim()}</div>
      ))
  )}
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
