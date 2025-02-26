import React, { useState, useEffect } from 'react';
import { listFilesInFolder, uploadFile } from './FirebaseService'; // Импортируем функцию uploadFile
import { getDownloadURL, StorageReference } from 'firebase/storage';

interface FileData {
  name: string;
  fullPath: string;
  url: string;
}

const FileManager = () => {
  const [selectedFolder, setSelectedFolder] = useState<string>(''); // Путь к текущей папке
  const [files, setFiles] = useState<FileData[]>([]); // Список файлов в текущей папке
  const [folders, setFolders] = useState<string[]>([]); // Список папок в текущей папке
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchFilesAndFolders = async () => {
      setLoading(true);
      try {
        // listFilesInFolder теперь возвращает объект с полями items и prefixes
        const { items, prefixes } = await listFilesInFolder(selectedFolder);

        // Используем Promise.all, чтобы получить все URL файлов асинхронно
        const filesData = await Promise.all(
          items.map(async (fileRef: any) => {
            const url = await getDownloadURL(fileRef); // Дожидаемся получения URL
            return { name: fileRef.name, fullPath: fileRef.fullPath, url }; // Возвращаем объект с данными о файле
          })
        );

        setFiles(filesData); // Устанавливаем полученные данные о файлах
        setFolders(prefixes); // Устанавливаем папки из prefixes
      } catch (error) {
        console.error('Error fetching files:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilesAndFolders();
  }, [selectedFolder]);

  // Обработчик перехода в папку
  const handleFolderChange = (folderPath: string) => {
    setSelectedFolder(folderPath);  // Обновляем путь к текущей папке
  };

  // Обработчик загрузки файла
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Получаем объект File
    if (file) {
      try {
        await uploadFile(file, selectedFolder);  // Загружаем файл в текущую папку
        alert('File uploaded successfully!');
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Error uploading file');
      }
    } else {
      console.log("No file selected");
    }
  };

  return (
    <div>
      <h2>File Manager</h2>
      <div>
        <input type="file" onChange={handleFileUpload} />
      </div>
      <div>
        <h3>Files in {selectedFolder || 'Root'}</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div>
              <h4>Folders:</h4>
              <ul>
                {folders.length > 0 ? (
                  folders.map((folderPath) => (
                    <li key={folderPath}>
                      <button onClick={() => handleFolderChange(folderPath)}>
                        {folderPath}
                      </button>
                    </li>
                  ))
                ) : (
                  <p>No folders available.</p>
                )}
              </ul>
            </div>
            <div>
              <h4>Files:</h4>
              <ul>
                {files.length > 0 ? (
                  files.map((file) => (
                    <li key={file.fullPath}>
                      <img src={file.url} alt={file.name} width={100} />
                      <p>{file.name}</p>
                    </li>
                  ))
                ) : (
                  <p>No files available in this folder.</p>
                )}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FileManager;
