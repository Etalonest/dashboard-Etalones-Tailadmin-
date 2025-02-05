// // Открытие базы данных и создание хранилища в IndexedDB

// export const openDB = () => {
//     return new Promise<IDBDatabase>((resolve, reject) => {
//       const request = indexedDB.open('candidatesDatabase', 1); // Название базы данных и версия
  
//       // Обработчик обновления структуры базы данных (если версия базы меняется)
//       request.onupgradeneeded = function (event) {
//         const db = request.result;
  
//         // Если хранилище для кандидатов еще не существует — создаем его
//         if (!db.objectStoreNames.contains('candidates')) {
//           db.createObjectStore('candidates');  // создаем хранилище с именем 'candidates'
//         }
//       };
  
//       // Обработчик успешного открытия базы данных
//       request.onsuccess = function () {
//         resolve(request.result);  // Возвращаем объект базы данных
//       };
  
//       // Обработчик ошибок
//       request.onerror = function () {
//         reject('Ошибка открытия базы данных');
//       };
//     });
//   };
  // Открытие базы данных и создание хранилищ для различных типов данных
export const openDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('appDataDatabase', 1); // Название базы данных и версия

    request.onupgradeneeded = function (event) {
      const db = request.result;

      // Если хранилище для кандидатов ещё не существует — создаём его
      if (!db.objectStoreNames.contains('candidates')) {
        db.createObjectStore('candidates');  // Хранилище для кандидатов
      }

      // Если хранилище для партнёров ещё не существует — создаём его
      if (!db.objectStoreNames.contains('partners')) {
        db.createObjectStore('partners');  // Хранилище для партнёров
      }

      // Если хранилище для настроек ещё не существует — создаём его
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings');  // Хранилище для настроек приложения
      }
    };

    request.onsuccess = function () {
      resolve(request.result);  // Возвращаем объект базы данных
    };

    request.onerror = function () {
      reject('Ошибка открытия базы данных');
    };
  });
};
