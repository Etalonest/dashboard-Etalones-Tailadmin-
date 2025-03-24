'use client';

import React, { useState } from 'react';

const PEx = () => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedCandidates, setParsedCandidates] = useState<any[]>([]);  // Для хранения парсенных данных
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);  // Для отображения превью

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

      const data = await response.json();

      // Убедитесь, что данные приходят как массив
      if (data.previewData && Array.isArray(data.previewData)) {
        setParsedCandidates(data.previewData);  // Сохраняем данные кандидатов
        setIsPreview(true);  // Включаем режим предварительного просмотра
      } else {
        setError('Не удалось разобрать данные из файла.');
      }

    } catch (error: any) {
      setError(error.message || 'Что-то пошло не так.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/pEx', {
        method: 'POST',
        body: JSON.stringify(parsedCandidates),  // Отправляем уже выбранных кандидатов
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Не удалось сохранить данные.');
      }

      const data = await response.json();
      setParsedCandidates(data.data);  // Сохраняем успешных кандидатов в parsedCandidates

      alert('Кандидаты успешно сохранены!');  // Уведомление о успешном сохранении

    } catch (error: any) {
      setError(error.message || 'Что-то пошло не так.');
    } finally {
      setLoading(false);
    }
  };

  // Функция для поиска кандидата по номеру телефона и возврата самого объекта
  const findDuplicateCandidate = (phone: string) => {
    return parsedCandidates.find((candidate: any) => candidate['phone'] === phone);
  };

  // Фильтрация уникальных кандидатов (без дублей)
  const getUniqueCandidates = () => {
    return parsedCandidates.filter((candidate: any) => {
      const duplicate = findDuplicateCandidate(candidate['контактный номер или ник в телеграм']);
      // Возвращаем только тех кандидатов, у которых нет дублей
      return !duplicate || duplicate === candidate;
    });
  };

  const handleSaveUnique = async () => {
    const uniqueCandidates = getUniqueCandidates();
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch('/api/pEx', {
        method: 'POST',
        body: JSON.stringify(uniqueCandidates),  // Отправляем только уникальных кандидатов
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Не удалось сохранить уникальных кандидатов.');
      }
  
      const data = await response.json();
      setParsedCandidates(data.data);  // Сохраняем успешных кандидатов в parsedCandidates
  
      alert('Уникальные кандидаты успешно сохранены!');  // Уведомление о успешном сохранении
  
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
          <table cellPadding="10" style={{ marginTop: '20px' }}>
            <thead>
              <tr>
                <th>Имя</th>
                <th>Телефон</th>
                <th>Профессии</th>
                <th>Комментарий</th>
                <th>Проверка на дубликат</th>
              </tr>
            </thead>
            <tbody>
              {parsedCandidates.map((candidate: any, index) => {
                // Проверка на дубликат
                const duplicate = findDuplicateCandidate(candidate['контактный номер или ник в телеграм']);
                
                return (
                  <tr key={index}>
                    <td>{candidate['Имя ']}</td>
                    <td>{candidate['контактный номер или ник в телеграм']}</td>
                    <td>
                      {candidate['специальность '] && Array.isArray(candidate['специальность '].split(',')) &&
                        candidate['специальность '].split(',').map((prof: string, idx: number) => (
                          <div key={idx}>{prof.trim()}</div>
                        ))
                      }
                    </td>
                    <td>
                      {candidate['примечание'] && (
                        <div>
                          <strong>Примечание:</strong> {candidate['примечание']}
                        </div>
                      )}
                    </td>
                    <td>
                      {/* Если дубликат найден, выводим его информацию */}
                      {duplicate ? (
                        <div>
                          <span style={{ color: 'red' }}>Дубликат</span>
                          <div>
                            <strong>Информация о дубликате:</strong>
                            <div>Имя: {duplicate['Имя ']}</div>
                            <div>Телефон: {duplicate['контактный номер или ник в телеграм']}</div>
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: 'green' }}>Уникальный</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* <button onClick={handleSave} disabled={loading}>Сохранить все данные</button> */}
          {/* Новая кнопка для сохранения только уникальных кандидатов */}
          <button onClick={handleSaveUnique} disabled={loading}>Сохранить уникальных кандидатов</button>
        </div>
      )}
    </div>
  );
};

export default PEx;
