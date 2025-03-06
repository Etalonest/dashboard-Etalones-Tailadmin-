'use client'
import { storage } from "@/src/lib/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "@firebase/storage";
import { useState } from "react";

interface FirebaseImagesUploadProps {
  city: string;
  jobTitle: string;
  onImagesUpload: (urls: string[]) => void;
}

const FirebaseImagesUpload = ({ city, jobTitle, onImagesUpload }: FirebaseImagesUploadProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleImagesChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setLoading(true);
      const newUploadedImages: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
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

          // Загружаем обработанное изображение в Firebase
          const storageRef = ref(storage, `vacancies/${city}-${jobTitle}/${file.name}`);
          const uploadTask = uploadBytesResumable(storageRef, processedImageBlob);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              // Можно отобразить прогресс загрузки, если нужно
            },
            (err) => {
              setError("Error uploading image. Please try again.");
              setLoading(false);
            },
            async () => {
              try {
                const fileUrl = await getDownloadURL(storageRef);
                newUploadedImages.push(fileUrl); // Добавляем URL загруженного изображения
                if (newUploadedImages.length === files.length) {
                  onImagesUpload(newUploadedImages); // Отправляем все URL-ы
                  setUploadedImages(newUploadedImages); // Обновляем состояние
                  setLoading(false);
                }
              } catch (err) {
                setError("Error fetching image URL. Please try again.");
                setLoading(false);
              }
            }
          );
        } catch (err) {
          setError("Error processing image. Please try again.");
          setLoading(false);
        }
      }
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 w-max">Загруженые фото жилья</label>
      <input
        type="file"
        multiple
        onChange={handleImagesChange}
        className="mt-2 p-2 border border-gray-300 rounded-md"
      />
      {loading && <p>Uploading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {/* <div className="mt-4">
        {uploadedImages.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700">Uploaded Images</h3>
            <div className="grid grid-cols-3 gap-4">
              {uploadedImages.map((imageUrl, index) => (
                <div key={index} className="p-2">
                  <img
                    src={imageUrl}
                    alt={`Uploaded Image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div> */}
    </div>
  );
};

export default FirebaseImagesUpload;
