'use client'
import { storage } from "@/src/lib/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "@firebase/storage";
import { useState } from "react";

interface FirebaseImagesUploadProps {
  city: string;
  jobTitle: string;
  onImagesUpload: (urls: string[]) => void;
}

const FirebaseWorkImagesUpload = ({ city, jobTitle, onImagesUpload }: FirebaseImagesUploadProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImagesChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setLoading(true);
      const newUploadedImages: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`Uploading file: ${file.name}`);

        const formData = new FormData();
        formData.append("file", file);

        try {
          const processImageResponse = await fetch('/api/processImage', {
            method: 'POST',
            body: formData,
          });

          if (!processImageResponse.ok) {
            throw new Error('Error processing image');
          }

          // Получаем обработанный файл
          const processedImageBlob = await processImageResponse.blob();
          console.log(`Image processed successfully: ${file.name}`);

          // Загружаем обработанное изображение в Firebase
          const storageRef = ref(storage, `vacancies/${city}-${jobTitle}/work/${file.name}${file.name}`);
          const uploadTask = uploadBytesResumable(storageRef, processedImageBlob);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              // Логируем прогресс загрузки
              console.log(`Uploading file: ${file.name} - Progress: ${snapshot.bytesTransferred} / ${snapshot.totalBytes}`);
            },
            (err) => {
              // Логируем ошибку загрузки
              console.error(`Error uploading file: ${file.name}`, err);
              setError("Error uploading image. Please try again.");
              setLoading(false);
            },
            async () => {
              try {
                const fileUrl = await getDownloadURL(storageRef);
                console.log(`Image uploaded successfully: ${file.name}, URL: ${fileUrl}`);
                newUploadedImages.push(fileUrl); // Добавляем URL загруженного изображения
                if (newUploadedImages.length === files.length) {
                  onImagesUpload(newUploadedImages); // Отправляем все URL-ы
                  setLoading(false);
                }
              } catch (err) {
                // Логируем ошибку получения URL
                console.error('Error fetching download URL:', err);
                setError("Error fetching image URL. Please try again.");
                setLoading(false);
              }
            }
          );
        } catch (err) {
          // Логируем ошибку обработки изображения
          console.error('Error processing image:', err);
          setError("Error processing image. Please try again.");
          setLoading(false);
        }
      }
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 w-max">Загруженые фото работы</label>
      <input
        type="file"
        multiple
        onChange={handleImagesChange}
        className="mt-2 p-2 border border-gray-300 rounded-md"
      />
      {loading && <p>Uploading...</p>}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
};

export default FirebaseWorkImagesUpload;
