'use client'
import { useState } from "react";

const UploadExel = () => {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState(null);
  
    const handleFileChange = (e) => {
      setFile(e.target.files[0]);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!file) {
        setStatus('Пожалуйста, выберите файл');
        return;
      }
  
      const formData = new FormData();
      formData.append('file', file);
  
      try {
        setStatus('Загрузка...');
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        if (response.ok) {
          setStatus('Данные успешно загружены!');
        } else {
          setStatus(`Ошибка: ${data.message}`);
        }
      } catch (error) {
        setStatus('Ошибка при загрузке файла');
      }
    };
  
    return (
      <div>
        <h1>Загрузить файл Excel</h1>
        <form onSubmit={handleSubmit}>
          <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
          <button type="submit">Загрузить</button>
        </form>
        {status && <p>{status}</p>}
      </div>
    );
  }

export default UploadExel