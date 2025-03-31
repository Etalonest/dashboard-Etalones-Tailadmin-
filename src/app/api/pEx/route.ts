// import { NextRequest, NextResponse } from 'next/server';
// import * as XLSX from 'xlsx';
// import Candidate from '@/src/models/Candidate'; // Модель для работы с MongoDB
// import { connectDB } from '@/src/lib/db'; // Функция для подключения к базе данных

// interface ExcelRow {
//   Имя: string;
//   'Контактный номер': string;
//   Мессенджер: string;
//   Специальность: string;
//   Примечание: string;
//   Ответственный: string;
//   Комментарий: string;
//   Статус: string;
//   isDuplicate?: boolean;
//   existingCandidate?: any; // Для хранения информации о дубликате
// }

// // Парсим Excel файл
// const parseExcel = (buffer: Buffer) => {
//   try {
//     const workbook = XLSX.read(buffer, { type: 'buffer' });
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];
//     return XLSX.utils.sheet_to_json(sheet) as ExcelRow[];
//   } catch (error) {
//     throw new Error('Failed to parse Excel file');
//   }
// };

// // Проверяем наличие кандидата по телефону (для парсинга Excel)
// const checkForDuplicatesInParsing = async (phone: string) => {
//   const existingCandidate = await Candidate.findOne({ phone: { $regex: phone, $options: 'i' } },).populate({path: 'manager', select: 'name'});
//   return existingCandidate;
// };

// // Преобразуем данные Excel в формат для хранения
// const mapExcelToCandidate = (candidate: ExcelRow) => {
//   return {
//     name: candidate.Имя,
//     phone: candidate['Контактный номер'],
//     professions: [{
//       name: candidate.Специальность,
//       expirience: '',
//     }],
//     status: candidate.Статус,
//     comment: [{
//       author: 'system',
//       text: [candidate.Примечание],
//       date: new Date(),
//     },
//     {
//       author: 'system',
//       text: [candidate.Комментарий],
//       date: new Date(),
//     }],
//     messenger: candidate.Мессенджер,
//     manager: candidate.Ответственный,
//   };
// };

// // Основной POST запрос
// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();

//     const contentType = req.headers.get('Content-Type');

//     if (contentType?.includes('multipart/form-data')) {
//       // Обрабатываем файл Excel
//       const formData = await req.formData();
//       const file = formData.get('file') as Blob;

//       if (!file) {
//         return NextResponse.json({ error: 'File not provided' }, { status: 400 });
//       }

//       const buffer = await file.arrayBuffer();
//       const data: ExcelRow[] = parseExcel(Buffer.from(buffer));

//       // Логируем полученные данные из файла
//       console.log('Полученные данные из файла:', data);

//       // Обработка данных и проверка на дубликаты
//       const dataWithDuplicates = await Promise.all(data.map(async (candidate) => {
//         if (!candidate['Контактный номер']) {
//           return { 
//             ...candidate, 
//             isDuplicate: false, 
//             existingCandidate: null 
//           };
//         }
        
//         const isDuplicate = await checkForDuplicatesInParsing(candidate['Контактный номер']);
//         return { 
//           ...candidate, 
//           isDuplicate: isDuplicate !== null, 
//           existingCandidate: isDuplicate || null 
//         };
//       }));

//       // Логируем данные с проверкой на дубликаты
//       console.log('Данные с проверкой на дубликаты:', dataWithDuplicates);

//       return NextResponse.json({
//         message: 'Data successfully parsed, preview it before saving.',
//         previewData: dataWithDuplicates, // Отправляем данные для отображения на фронте
//       });

//     } else if (contentType?.includes('application/json')) {
//       // Получаем данные из тела запроса (JSON, это данные, которые пришли из фронтенда)
//       const candidates = await req.json();

//       console.log('Полученные данные из JSON:', candidates);

//       // Обработка данных перед сохранением
//       const candidatesToSave = await Promise.all(candidates.map(async (candidate: any) => {
//         const candidateData = mapExcelToCandidate(candidate); // Преобразуем данные в нужный формат
//         console.log('Кандидат, который будет сохранён:', candidateData);  // Логируем каждого кандидата

//         // Проверка на дубликаты при сохранении (не связана с Excel, только с сохранением в базу)
//         const isDuplicate = await checkForDuplicatesInParsing(candidateData.phone);
        
//         if (!isDuplicate) {
//           return candidateData; // Если кандидата нет в базе, то добавляем его
//         } else {
//           console.log('Дубликат, не будет сохранён:', candidateData);
//           return null; // Возвращаем null для кандидатов, которые уже есть в базе
//         }
//       }));

//       // Убираем null из массива (кандидаты, которые не прошли проверку)
//       const uniqueCandidates = candidatesToSave.filter(candidate => candidate !== null);

//       if (uniqueCandidates.length > 0) {
//         // Сохраняем уникальных кандидатов в базу данных
//         const savedCandidates = await Candidate.insertMany(uniqueCandidates);
//         console.log('Кандидаты успешно сохранены:', savedCandidates);


//         return NextResponse.json({ message: 'Data successfully uploaded', data: savedCandidates });
//       } else {
//         return NextResponse.json({ message: 'No unique candidates to upload.' });
//       }

//     } else {
//       return NextResponse.json({ error: 'Unsupported Content-Type' }, { status: 415 });
//     }

//   } catch (error: any) {
//     console.error('Ошибка обработки запроса:', error);  // Логируем ошибку
//     return NextResponse.json({ error: 'Failed to process request', details: error.message }, { status: 500 });
//   }
// }
import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import Candidate from '@/src/models/Candidate'; // Модель для работы с MongoDB
import { connectDB } from '@/src/lib/db'; // Функция для подключения к базе данных
import Stage from '@/src/models/Stage'; // Модель для работы со стадиями

interface ExcelRow {
  Имя: string;
  'Контактный номер': string;
  Мессенджер: string;
  Специальность: string;
  Примечание: string;
  Ответственный: string;
  Комментарий: string;
  Статус: string;
  isDuplicate?: boolean;
  existingCandidate?: any; // Для хранения информации о дубликате
}

// Парсим Excel файл
const parseExcel = (buffer: Buffer) => {
  try {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(sheet) as ExcelRow[];
  } catch (error) {
    throw new Error('Failed to parse Excel file');
  }
};

// Проверяем наличие кандидата по телефону (для парсинга Excel)
const checkForDuplicatesInParsing = async (phone: string) => {
  const existingCandidate = await Candidate.findOne({ phone: { $regex: phone, $options: 'i' } }).populate({ path: 'manager', select: 'name' });
  return existingCandidate;
};

// Преобразуем данные Excel в формат для хранения
const mapExcelToCandidate = (candidate: ExcelRow) => {
  return {
    name: candidate.Имя,
    phone: candidate['Контактный номер'],
    professions: [{
      name: candidate.Специальность,
      expirience: '',
    }],
    status: candidate.Статус,
    comment: [{
      author: 'system',
      text: [candidate.Примечание],
      date: new Date(),
    },
    {
      author: 'system',
      text: [candidate.Комментарий],
      date: new Date(),
    }],
    messenger: candidate.Мессенджер,
    manager: candidate.Ответственный,
  };
};

// Основной POST запрос
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const contentType = req.headers.get('Content-Type');

    if (contentType?.includes('multipart/form-data')) {
      // Обрабатываем файл Excel
      const formData = await req.formData();
      const file = formData.get('file') as Blob;

      if (!file) {
        return NextResponse.json({ error: 'File not provided' }, { status: 400 });
      }

      const buffer = await file.arrayBuffer();
      const data: ExcelRow[] = parseExcel(Buffer.from(buffer));

      // Логируем полученные данные из файла
      console.log('Полученные данные из файла:', data);

      // Обработка данных и проверка на дубликаты
      const dataWithDuplicates = await Promise.all(data.map(async (candidate) => {
        if (!candidate['Контактный номер']) {
          return { 
            ...candidate, 
            isDuplicate: false, 
            existingCandidate: null 
          };
        }
        
        const isDuplicate = await checkForDuplicatesInParsing(candidate['Контактный номер']);
        return { 
          ...candidate, 
          isDuplicate: isDuplicate !== null, 
          existingCandidate: isDuplicate || null 
        };
      }));

      // Логируем данные с проверкой на дубликаты
      console.log('Данные с проверкой на дубликаты:', dataWithDuplicates);

      return NextResponse.json({
        message: 'Data successfully parsed, preview it before saving.',
        previewData: dataWithDuplicates, // Отправляем данные для отображения на фронте
      });

    } else if (contentType?.includes('application/json')) {
      // Получаем данные из тела запроса (JSON, это данные, которые пришли из фронтенда)
      const candidates = await req.json();

      console.log('Полученные данные из JSON:', candidates);

      // Обработка данных перед сохранением
      const candidatesToSave = await Promise.all(candidates.map(async (candidate: any) => {
        const candidateData = mapExcelToCandidate(candidate); // Преобразуем данные в нужный формат
        console.log('Кандидат, который будет сохранён:', candidateData);  // Логируем каждого кандидата

        // Проверка на дубликаты при сохранении (не связана с Excel, только с сохранением в базу)
        const isDuplicate = await checkForDuplicatesInParsing(candidateData.phone);
        
        if (!isDuplicate) {
          return candidateData; // Если кандидата нет в базе, то добавляем его
        } else {
          console.log('Дубликат, не будет сохранён:', candidateData);
          return null; // Возвращаем null для кандидатов, которые уже есть в базе
        }
      }));

      // Убираем null из массива (кандидаты, которые не прошли проверку)
      const uniqueCandidates = candidatesToSave.filter(candidate => candidate !== null);

      if (uniqueCandidates.length > 0) {
        // Сохраняем уникальных кандидатов в базу данных
        const savedCandidates = await Candidate.insertMany(uniqueCandidates);
        console.log('Кандидаты успешно сохранены:', savedCandidates);

        // Получаем ID стадии из .env
        const stageId = process.env.NEXT_PUBLIC_CANDIDATES_STAGE_NEW;

        if (stageId) {
          // Добавляем кандидатов в массив вакансий на стадии
          const updatedStage = await Stage.findOneAndUpdate(
            { _id: stageId }, // Используем ID стадии из .env
            { $push: { candidates: { $each: savedCandidates.map(c => c._id) } } }, // Добавляем в массив кандидатов
            { new: true }
          );

          console.log('Стадия успешно обновлена:', updatedStage);

          return NextResponse.json({
            message: 'Data successfully uploaded and Stage updated.',
            data: savedCandidates,
            updatedStage,  // Добавляем обновленный Stage в ответ
          });
        } else {
          return NextResponse.json({
            error: 'Stage ID not found in .env file.',
          }, { status: 500 });
        }

      } else {
        return NextResponse.json({ message: 'No unique candidates to upload.' });
      }

    } else {
      return NextResponse.json({ error: 'Unsupported Content-Type' }, { status: 415 });
    }

  } catch (error: any) {
    console.error('Ошибка обработки запроса:', error);  // Логируем ошибку
    return NextResponse.json({ error: 'Failed to process request', details: error.message }, { status: 500 });
  }
}
