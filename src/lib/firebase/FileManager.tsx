import React, { useState, useEffect } from 'react';
import { listFilesInFolder, uploadFile, deleteFile } from './FirebaseService'; // Импортируем ваши функции
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleX, SquareChevronLeft } from 'lucide-react';

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
        // Используем функцию listFilesInFolder из FirebaseService
        const { items, prefixes } = await listFilesInFolder(selectedFolder);

        setFiles(items); // Ставим файлы
        setFolders(prefixes); // Ставим папки
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
        // Загружаем файл в текущую папку
        const downloadURL = await uploadFile(file, selectedFolder);
        alert('File uploaded successfully! URL: ' + downloadURL);
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Error uploading file');
      }
    } else {
      console.log("No file selected");
    }
  };

  // Функция для удаления файла
  const handleDeleteFile = async (filePath: string) => {
    try {
      await deleteFile(filePath); // Вызываем функцию удаления из Firebase
      // После удаления удаляем файл из списка
      setFiles((prevFiles) => prevFiles.filter((file) => file.fullPath !== filePath));
      alert('File deleted successfully!');
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Error deleting file');
    }
  };

  // Функция для создания хлебных крошек
  const getBreadcrumbs = () => {
    const pathParts = selectedFolder.split('/').filter((part) => part); // Разбиваем путь на части
    const breadcrumbs = [];

    let currentPath = '';
    for (let i = 0; i < pathParts.length; i++) {
      currentPath += '/' + pathParts[i];
      breadcrumbs.push(
        <span key={currentPath} style={{ cursor: 'pointer', color: 'blue' }} onClick={() => setSelectedFolder(currentPath)}>
          {pathParts[i]}
        </span>
      );
      if (i < pathParts.length - 1) {
        breadcrumbs.push(' / '); // Добавляем разделитель между крошками
      }
    }

    return breadcrumbs.length > 0 ? [ ...breadcrumbs] : ['Root'];
  };

  // Функция для выхода в родительскую папку
  const handleGoBack = () => {
    const parentFolder = selectedFolder.substring(0, selectedFolder.lastIndexOf('/'));
    setSelectedFolder(parentFolder || ''); // Если мы в корне, очищаем путь
  };

  return (
    <div>
      <h2>File Manager</h2>
      <div>
        <Input type="file" onChange={handleFileUpload} />
      </div>
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className='flex  items-center gap-2'>
            {selectedFolder && selectedFolder !== '' && (
                <button onClick={handleGoBack} style={{ marginTop: '10px' }}>
                 <SquareChevronLeft/>
                </button>
              )}
              <div>
                {getBreadcrumbs()}
              </div>
              
            </div>

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
              <div className='grid grid-cols-3 gap-2'>
  {files.length > 0 ? (
    files.map((file) => (
      <Card key={file.fullPath} className='relative'>
        <CardHeader >
          <p className='truncate w-20' title={file.name}>{file.name}</p> 
          <button onClick={() => handleDeleteFile(file.fullPath)} className='absolute right-2 top-2'>
            <CircleX color='red' />
          </button>
        </CardHeader>
        <Image 
          src={file.url} 
          alt={file.name} 
          width={380} 
          height={380} 
        />
      </Card>
    ))
  ) : (
    <p>No files available in this folder.</p>
  )}
</div>

            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FileManager;
