import { Manager } from "../types/manager";
import { openDb } from "./db";

// Сохранение или обновление менеджера в IndexedDB
export const saveManagerToDb = async (manager: Manager): Promise<string> => {
  if (!manager._id) {
    return Promise.reject("Manager does not have an '_id' field, unable to save.");
  }

  const db = await openDb();
  const transaction = db.transaction("managers", "readwrite");
  const store = transaction.objectStore("managers");

  const request = store.put(manager); // put будет обновлять объект, если _id уже существует

  return new Promise<string>((resolve, reject) => {
    request.onsuccess = () => {
      console.log("Менеджер успешно сохранен в IndexedDB:", manager);
      resolve("Manager saved to DB");
    };

    request.onerror = () => {
      console.error("Ошибка при сохранении менеджера в IndexedDB:", manager);
      reject("Failed to save manager");
    };
  });
};
