"use client";  // Указывает, что компонент должен рендериться на клиенте

import { ImageDown } from "lucide-react";
import { useRef, ChangeEvent, useState } from "react";

const AddDocument = () => {
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleClick = () => {
        fileInputRef.current?.click();  // Открываем выбор файла при клике на иконку
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);  
        }
    };

    const handleUpload = async () => {
        if (file) {
            const formData = new FormData();
            formData.append("file", file); // Добавляем файл в FormData

            try {
                // Отправляем файл на API роут /api/test
                const res = await fetch("/api/test", {
                    method: "POST",
                    body: formData,
                });

                if (res.ok) {
                    const data = await res.json();
                    alert(`Файл успешно загружен! ID документа: ${data.documentId}`);
                } else {
                    alert("Ошибка загрузки файла");
                }
            } catch (error) {
                console.error("Ошибка при загрузке файла", error);
                alert("Ошибка при загрузке файла");
            }
        }
    };

    return (
        <div>
            <ImageDown onClick={handleClick} style={{ cursor: "pointer" }} />
            <input
                ref={fileInputRef}
                type="file"
                style={{ display: "none" }}
                onChange={handleFileChange}
            />
            <button onClick={handleUpload} disabled={!file}>
                Загрузить файл
            </button>
        </div>
    );
};

export default AddDocument;
