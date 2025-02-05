// lib/db.ts

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
  
  // Функция для сохранения данных в IndexedDB
  export const saveToIndexedDB = async (storeName: string, key: string, data: any[]) => {
    const db = await openDB();
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
  
    data.forEach((item) => {
      store.put(item, key); // Сохраняем элементы в хранилище по ключу
    });
  
    transaction.oncomplete = function () {
      console.log(`${storeName} сохранены в IndexedDB`);
    };
  
    transaction.onerror = function () {
      console.error(`Ошибка при сохранении ${storeName} в IndexedDB`);
    };
  };
  
  // Функция для получения данных из IndexedDB
  export const getFromIndexedDB = async (storeName: string, key: string) => {
    const db = await openDB();
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
  
    const request = store.get(key);  // Получаем данные по ключу
    return new Promise<any[]>((resolve, reject) => {
      request.onsuccess = function () {
        resolve(request.result || []);  // Возвращаем результат (данные)
      };
  
      request.onerror = function () {
        reject(`Ошибка получения данных из ${storeName}`);
      };
    });
  };
  