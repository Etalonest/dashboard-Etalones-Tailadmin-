// // src/app/api/upload/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { storage } from '@/src/lib/firebase'; // Импортируйте ваш firebase конфиг
// import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; 

// export const POST = async (req: NextRequest) => {
//   try {
//     const formData = await req.formData();
//     const file = formData.get('file') as File;

//     if (!file) {
//       return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
//     }

//     // Создание ссылки на файл в хранилище
//     const fileRef = ref(storage, `uploads/${file.name}`);

//     // Используем uploadBytesResumable для загрузки файла
//     const uploadTask = uploadBytesResumable(fileRef, file);

//     // Дожидаемся завершения загрузки
//     await uploadTask;

//     // Получаем URL загруженного файла
//     const fileUrl = await getDownloadURL(fileRef);

//     return NextResponse.json({ url: fileUrl });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ message: 'Error uploading file' }, { status: 500 });
//   }
// };
import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/src/lib/firebase'; // Импортируем конфиг Firebase
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// Универсальная функция для генерации пути
const generateFilePath = (contentType: string, id: string, fileType: string, fileName: string) => {
  return `${contentType}/${id}/${fileType}/${fileName}`;
};

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();

    const contentType = formData.get('contentType') as string; // Тип контента (например, 'vacancies', 'managers')
    const id = formData.get('id') as string; // ID ресурса (например, ID вакансии, новости и т.д.)
    const file = formData.get('file') as File; // Загружаемый файл

    if (!contentType || !id || !file) {
      return NextResponse.json({ message: 'Missing content type, ID, or file' }, { status: 400 });
    }

    // Генерация пути для файла
    const filePath = generateFilePath(contentType, id, 'image', file.name);
    const fileRef = ref(storage, filePath);

    // Загружаем файл
    const uploadTask = uploadBytesResumable(fileRef, file);
    await uploadTask; // Дожидаемся завершения загрузки

    // Получаем URL загруженного файла
    const fileUrl = await getDownloadURL(fileRef);

    return NextResponse.json({ fileUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error uploading file' }, { status: 500 });
  }
};
