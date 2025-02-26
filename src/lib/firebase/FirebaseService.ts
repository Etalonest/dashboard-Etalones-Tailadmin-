import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll, StorageReference } from "firebase/storage";
import { storage } from "./firebaseConfig";

// Тип для файлов, возвращаемых из Storage
interface FileData {
  name: string;
  fullPath: string;
  url: string;
}

// Функция для загрузки файла в Firebase Storage
export const uploadFile = async (file: File, folderPath: string): Promise<string> => {
  const storageRef = ref(storage, `${folderPath}/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      null,
      (error) => reject(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => resolve(downloadURL));
      }
    );
  });
};

// Функция для получения списка файлов и папок в папке
export const listFilesInFolder = async (folderPath: string) => {
  const folderRef = ref(storage, folderPath);
  const res = await listAll(folderRef);

  const filesData = await Promise.all(
    res.items.map(async (fileRef: StorageReference) => {
      const url = await getDownloadURL(fileRef);
      return { name: fileRef.name, fullPath: fileRef.fullPath, url }; // возвращаем объект с данными о файле
    })
  );

  const folderPaths = res.prefixes.map((prefix: StorageReference) => prefix.fullPath); // возвращаем пути к папкам

  return { items: filesData, prefixes: folderPaths };
};

// Функция для удаления файла
export const deleteFile = async (filePath: string): Promise<void> => {
  const fileRef = ref(storage, filePath);
  await deleteObject(fileRef);
};

// Функция для перемещения файла (копирование + удаление)
export const moveFile = async (sourcePath: string, destinationPath: string): Promise<void> => {
  const fileRef = ref(storage, sourcePath);

  // Получаем URL файла
  const fileUrl = await getDownloadURL(fileRef);

  // Загружаем файл как объект File с помощью fetch
  const response = await fetch(fileUrl);
  const blob = await response.blob();
  const file = new File([blob], sourcePath.split('/').pop() || 'file'); // создаем объект File

  // Загружаем файл в новое место
  await uploadFile(file, destinationPath);

  // Удаление старого файла
  await deleteObject(fileRef);
};
