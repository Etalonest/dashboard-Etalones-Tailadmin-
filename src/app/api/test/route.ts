import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/db'; // Подключение к базе данных
import Document from '@/src/models/Document'; // Модель для документа

export const config = {
  api: {
    bodyParser: false, // Отключаем встроенный парсер для работы с FormData
  },
};

export const POST = async (req: NextRequest) => {
  try {
    console.log("Запрос на загрузку документа. Начало обработки.");

    // Подключаемся к базе данных
    console.log("Подключаемся к базе данных...");
    await connectDB();
    console.log("Подключение к базе данных установлено.");

    // Получаем данные из FormData
    const data = await req.formData();
    console.log("Данные из формы получены:", data);

    const file = data.get('file') as File; // Получаем файл из FormData
    console.log("Получен файл:", file ? file.name : "Нет файла");

    if (!file) {
      console.log("Ошибка: файл не был передан.");
      return NextResponse.json({ message: 'Файл не был передан.' }, { status: 400 });
    }

    // Преобразуем файл в Buffer
    console.log("Преобразуем файл в Buffer...");
    const bufferData = await file.arrayBuffer();
    const buffer = Buffer.from(bufferData); // Преобразуем в Buffer
    console.log("Файл успешно преобразован в Buffer.");

    // Создаем документ для сохранения в базе данных
    console.log("Создаем новый документ в базе данных...");
    const document = new Document({
      file: {
        name: file.name,         // Имя файла
        data: buffer,            // Сохраняем файл как бинарные данные (Buffer)
        contentType: file.type,  // Тип контента
      },
    });

    // Сохраняем документ в базе
    const savedDocument = await document.save();
    console.log("Документ успешно сохранен в базе данных:", savedDocument._id);

    // Возвращаем успешный ответ
    return NextResponse.json({ message: 'Файл успешно загружен', documentId: savedDocument._id }, { status: 201 });
  } catch (error) {
    // Логируем ошибку
    console.error("Ошибка при загрузке файла:", error);
    return NextResponse.json({ message: 'Ошибка при загрузке файла.' }, { status: 500 });
  }
};
