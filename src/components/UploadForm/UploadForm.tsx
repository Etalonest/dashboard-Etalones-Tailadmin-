// // FirebaseImageUpload.tsx
// 'use client'
// import { useState } from "react";
// import { storage } from "@/src/lib/firebase";  // Import your Firebase config
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { v4 as uuidv4 } from 'uuid';

// interface FirebaseImageUploadProps {
//   onImageUpload: (url: string) => void; // Callback to pass back the image URL
// }

// const FirebaseImageUpload = ({ onImageUpload }: FirebaseImageUploadProps) => {
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setLoading(true);
//       const fileName = uuidv4() + "-" + file.name; // Generate unique file name
//       const storageRef = ref(storage, `vacancies/${fileName}`);

//       try {
//         await uploadBytes(storageRef, file);
//         const downloadURL = await getDownloadURL(storageRef);
//         onImageUpload(downloadURL); // Pass the image URL back to parent
//         setLoading(false);
//       } catch (err) {
//         setError("Error uploading image. Please try again.");
//         setLoading(false);
//       }
//     }
//   };

//   return (
//     <div>
//       <label className="block text-sm font-medium text-gray-700">Upload Main Image</label>
//       <input
//         type="file"
//         onChange={handleImageChange}
//         className="mt-2 p-2 border border-gray-300 rounded-md"
//       />
//       {loading && <p>Uploading...</p>}
//       {error && <p className="text-red-600">{error}</p>}
//     </div>
//   );
// };

// export default FirebaseImageUpload;
// FirebaseImageUpload.tsx
// 'use client'
// import { useState } from "react";
// import { storage } from "@/src/lib/firebase";  // Подключаем Firebase
// import { ref, uploadBytes, getDownloadURL, getMetadata } from "firebase/storage";
// import { v4 as uuidv4 } from 'uuid';

// interface FirebaseImageUploadProps {
//   city: string; // Город
//   jobTitle: string; // Название вакансии
//   onImageUpload: (url: string) => void; // Callback для передачи URL загруженной картинки
// }

// const FirebaseImageUpload = ({ city, jobTitle, onImageUpload }: FirebaseImageUploadProps) => {
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   // Генерация уникального имени для файла
//   const generateFileName = (file: File) => {
//     const uniqueName = uuidv4() + "-" + file.name;
//     return uniqueName;
//   };

//   // Проверка, существует ли файл с таким именем
//   const checkIfFolderExists = async (folderPath: string) => {
//     const folderRef = ref(storage, folderPath);
//     try {
//       const metadata = await getMetadata(folderRef);
//       return metadata !== null; // Если файл существует
//     } catch (error) {
//       return false; // Если файл не существует
//     }
//   };

//   // Функция для добавления суффикса, если папка уже существует
//   const generateUniqueFolderName = async (city: string, jobTitle: string) => {
//     let folderName = `${city}-${jobTitle}`;
//     let counter = 1;
//     let isFolderExists = await checkIfFolderExists(`vacancies/${folderName}`);

//     // Добавляем суффикс, пока не найдем уникальное имя
//     while (isFolderExists) {
//       counter++;
//       folderName = `${city}-${jobTitle}-${counter}`;
//       isFolderExists = await checkIfFolderExists(`vacancies/${folderName}`);
//     }

//     return folderName;
//   };

//   const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setLoading(true);
//       const fileName = generateFileName(file);
//       const folderName = await generateUniqueFolderName(city, jobTitle); // Получаем уникальное имя для папки

//       // Проверяем, существует ли файл с таким именем в папке вакансии
//       const fileExists = await checkIfFolderExists(`vacancies/${folderName}/${fileName}`);

//       if (fileExists) {
//         // Если файл существует, используем его URL
//         const existingFileUrl = `https://firebasestorage.googleapis.com/v0/b/etalones-25a5f.firebasestorage.app/o/vacancies%2F${folderName}%2F${fileName}?alt=media`;
//         onImageUpload(existingFileUrl); // Передаем URL существующего изображения
//         setLoading(false);
//       } else {
//         const storageRef = ref(storage, `vacancies/${folderName}/${fileName}`);
//         try {
//           await uploadBytes(storageRef, file); // Загружаем файл
//           const downloadURL = await getDownloadURL(storageRef);
//           onImageUpload(downloadURL); // Передаем URL загруженного файла
//           setLoading(false);
//         } catch (err) {
//           setError("Error uploading image. Please try again.");
//           setLoading(false);
//         }
//       }
//     }
//   };

//   return (
//     <div>
//       <label className="block text-sm font-medium text-gray-700">Upload Main Image</label>
//       <input
//         type="file"
//         onChange={handleImageChange}
//         className="mt-2 p-2 border border-gray-300 rounded-md"
//       />
//       {loading && <p>Uploading...</p>}
//       {error && <p className="text-red-600">{error}</p>}
//     </div>
//   );
// };

// export default FirebaseImageUpload;
'use client'
import { storage } from "@/src/lib/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "@firebase/storage";
import { useState } from "react";

interface FirebaseImageUploadProps {
  city: string;
  jobTitle: string;
  onImageUpload: (url: string) => void;
}

const FirebaseImageUpload = ({ city, jobTitle, onImageUpload }: FirebaseImageUploadProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      try {
        // Отправляем файл на ваш API для обработки
        const processImageResponse = await fetch('/api/processImage', {
          method: 'POST',
          body: formData,
        });

        if (!processImageResponse.ok) {
          throw new Error('Error processing image');
        }

        const processedImageBlob = await processImageResponse.blob();

        // Теперь, когда изображение обработано, загружаем его в Firebase
        const storageRef = ref(storage, `vacancies/${city}-${jobTitle}/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, processedImageBlob);

        await uploadTask;

        const fileUrl = await getDownloadURL(storageRef);
        onImageUpload(fileUrl); // Передаем URL загруженного файла
        setLoading(false);
      } catch (err) {
        setError("Error uploading image. Please try again.");
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Главное загруженное изображение</label>
      <input
        type="file"
        onChange={handleImageChange}
        className="mt-2 p-2 border border-gray-300 rounded-md"
      />
      {loading && <p>Загрузка...</p>}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
};

export default FirebaseImageUpload;
