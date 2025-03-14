// // Получение кандидатов из IndexedDB

// import { Manager } from '../types/manager';
import { openDb } from './db';

export const getManagerFromDb = async (_id: string) => {
  const db = await openDb();
  const transaction = db.transaction('managers', 'readonly');
  const store = transaction.objectStore('managers');
  const request = store.get(_id);  // Используем _id для получения менеджера

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject('Failed to get manager');
  });
};
// export const getManagerFromDb = async (): Promise<Manager | null> => {
//   const db = await openDb();
//   const transaction = db.transaction('managers', 'readonly');
//   const store = transaction.objectStore('managers');
//   const request = store.get(1);  // предполагаем, что 1 — это ID менеджера

//   return new Promise<Manager | null>((resolve, reject) => {
//     request.onsuccess = () => {
//       const result = request.result;
//       if (result) {
//         console.log("Менеджер успешно получен из IndexedDB:", result);
//         resolve(result);
//       } else {
//         console.log("Менеджер не найден в базе данных.");
//         resolve(null);
//       }
//     };
//     request.onerror = () => {
//       console.error("Ошибка при получении менеджера из базы данных");
//       reject('Failed to get manager');
//     };
//   });
// };
