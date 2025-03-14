import { MongoClient } from 'mongodb';
import * as XLSX from 'xlsx';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,  // Отключаем парсинг тела запроса, чтобы работать с файлами
  },
};

const uploadHandler = async (req, res) => {
  // Обработка файла с помощью formidable
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: 'Ошибка при обработке файла' });
    }

    // Получаем путь к загруженному файлу
    const filePath = files.file[0].filepath;

    try {
      // Чтение Excel файла с помощью xlsx
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];  // Берем первый лист
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);  // Преобразуем в JSON

      // Подключение к MongoDB
      const client = new MongoClient('mongodb://localhost:27017'); // Замени на твой URI MongoDB
      await client.connect();
      const db = client.db('your_database_name'); // Замени на имя своей базы данных
      const collection = db.collection('your_collection_name'); // Замени на имя коллекции

      // Запись данных в MongoDB
      const result = await collection.insertMany(jsonData);

      // Ответ пользователю
      res.status(200).json({ message: 'Данные успешно загружены', result });
    } catch (error) {
      console.error('Ошибка:', error);
      res.status(500).json({ message: 'Произошла ошибка при обработке данных' });
    } finally {
      // Удаление временного файла
      fs.unlinkSync(filePath);
    }
  });
};

export default uploadHandler;
