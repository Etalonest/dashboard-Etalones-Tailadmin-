// Сохранение кандидатов в IndexedDB

import { openDB } from './openDB';

export const saveToIndexedDB = async (managerId: string, candidates: any[]) => {
  const db = await openDB(); // Открываем базу данных
  const transaction = db.transaction('candidates', 'readwrite'); // Создаем транзакцию
  const store = transaction.objectStore('candidates'); // Получаем хранилище "candidates"

  // Сохраняем кандидатов с ключом managerId
  candidates.forEach((candidate) => {
    store.put(candidate, managerId); // Сохраняем каждого кандидата в базе данных
  });

  transaction.oncomplete = function() {
    console.log('Кандидаты сохранены в IndexedDB');
  };

  transaction.onerror = function() {
    console.error('Ошибка при сохранении кандидатов в IndexedDB');
  };
};
