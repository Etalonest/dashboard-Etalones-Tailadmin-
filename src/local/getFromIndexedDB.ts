// Получение кандидатов из IndexedDB

import { openDB } from './openDB';

export const getFromIndexedDB = async (managerId: string) => {
  const db = await openDB(); // Открываем базу данных
  const transaction = db.transaction('candidates', 'readonly'); // Создаем транзакцию для чтения
  const store = transaction.objectStore('candidates'); // Получаем хранилище "candidates"

  const request = store.get(managerId); // Получаем кандидатов для данного managerId
  return new Promise<any[]>((resolve, reject) => {
    request.onsuccess = function () {
      resolve(request.result || []); // Возвращаем результат (кандидатов)
    };

    request.onerror = function () {
      reject('Ошибка получения данных');
    };
  });
};
