// import { NextRequest, NextResponse } from 'next/server';
// import Candidate from '@/src/models/Candidate'; // Модель для работы с MongoDB
// import { connectDB } from '@/src/lib/db'; // Функция для подключения к базе данных

// // Функция для сохранения уникальных кандидатов
// const saveCandidates = async (candidates: any[]) => {
//   try {
//     console.log('Начинаем процесс сохранения уникальных кандидатов...');

//     // Проходим по каждому кандидату и проверяем его на дубликаты
//     const uniqueCandidates = await Promise.all(candidates.map(async (candidate) => {
//       console.log(`Проверяем кандидата с телефоном: ${candidate.phone}`);

//       const isDuplicate = await Candidate.findOne({ phone: candidate.phone });

//       if (!isDuplicate) {
//         console.log(`Кандидат с телефоном ${candidate.phone} уникален, сохраняем в базу.`);
//         const savedCandidate = new Candidate(candidate);
//         await savedCandidate.save();  // Сохраняем кандидата в базу данных
//         return savedCandidate;
//       } else {
//         console.log(`Кандидат с телефоном ${candidate.phone} является дубликатом. Пропускаем.`);
//         return null;
//       }
//     }));

//     // Фильтруем только уникальных кандидатов (которые не null)
//     const savedCandidates = uniqueCandidates.filter(candidate => candidate !== null);

//     console.log(`Процесс завершён. Сохранено уникальных кандидатов: ${savedCandidates.length}`);
//     return savedCandidates;

//   } catch (error: any) {
//     console.error('Ошибка при сохранении кандидатов:', error);
//     throw new Error('Не удалось сохранить кандидатов.');
//   }
// };

// // Основной POST запрос для сохранения кандидатов
// export async function POST(req: NextRequest) {
//   try {
//     console.log('Начинаем обработку POST запроса для сохранения кандидатов.');
    
//     await connectDB();
//     console.log('Подключение к базе данных успешно выполнено.');

//     const contentType = req.headers.get('Content-Type');

//     if (contentType?.includes('application/json')) {
//       console.log('Получаем данные из тела запроса (формат JSON).');

//       const candidates = await req.json();  // Получаем данные из тела запроса (JSON)

//       console.log(`Получено ${candidates.length} кандидатов для обработки.`);

//       // Процесс преобразования каждого кандидата
//       const transformedCandidates = candidates.map((candidate: any) => {
//         // Собираем все ключи и их значения в строку для комментария
//         const candidateDetails = Object.entries(candidate)
//           .map(([key, value]) => `${key}: ${value}`)
//           .join(', ');  // Объединяем все ключи и значения через запятую

//         console.log("Собранные данные для комментария:", candidateDetails);

//         return {
//           name: candidate['Имя'], // Используем имя как ключ
//           phone: candidate['Контактный номер'], // Используем номер телефона
//           source: 'excel',
//           status: candidate['Статус'], // Используем статус
//           comment: [
//             {
//               author: 'system',
//               text: candidateDetails,  // Все ключи кандидата в одном комментарии
//               date: new Date(),
//             },
//           ],
//         };
//       });

//       console.log('Преобразованные кандидаты:', transformedCandidates);

//       // Сохраняем уникальных кандидатов
//       const savedCandidates = await saveCandidates(transformedCandidates);

//       if (savedCandidates.length > 0) {
//         console.log('Кандидаты успешно сохранены в базу данных.');
//         return NextResponse.json({ message: 'Кандидаты успешно сохранены', data: savedCandidates });
//       } else {
//         console.log('Нет уникальных кандидатов для сохранения.');
//         return NextResponse.json({ message: 'Нет уникальных кандидатов для сохранения.' });
//       }

//     } else {
//       console.log('Получен неподдерживаемый Content-Type. Ожидается application/json.');
//       return NextResponse.json({ error: 'Unsupported Content-Type' }, { status: 415 });
//     }

//   } catch (error: any) {
//     console.error('Ошибка обработки запроса:', error);
//     return NextResponse.json({ error: 'Не удалось обработать запрос', details: error.message }, { status: 500 });
//   }
// }
import { NextRequest, NextResponse } from 'next/server';
import Candidate from '@/src/models/Candidate'; // Модель для работы с MongoDB
import { connectDB } from '@/src/lib/db'; // Функция для подключения к базе данных

// Функция для сохранения уникальных кандидатов
const saveCandidates = async (candidates: any[]) => {
  try {
    console.log('Начинаем процесс сохранения уникальных кандидатов...');

    // Проходим по каждому кандидату и проверяем его на дубликаты
    const uniqueCandidates = await Promise.all(candidates.map(async (candidate) => {
      console.log(`Проверяем кандидата с телефоном: ${candidate.phone}`);

      const isDuplicate = await Candidate.findOne({ phone: candidate.phone });

      if (!isDuplicate) {
        console.log(`Кандидат с телефоном ${candidate.phone} уникален, сохраняем в базу.`);
        const savedCandidate = new Candidate(candidate);
        await savedCandidate.save();  // Сохраняем кандидата в базу данных
        return savedCandidate;
      } else {
        console.log(`Кандидат с телефоном ${candidate.phone} является дубликатом. Пропускаем.`);
        return null;
      }
    }));

    // Фильтруем только уникальных кандидатов (которые не null)
    const savedCandidates = uniqueCandidates.filter(candidate => candidate !== null);

    console.log(`Процесс завершён. Сохранено уникальных кандидатов: ${savedCandidates.length}`);
    return savedCandidates;

  } catch (error: any) {
    console.error('Ошибка при сохранении кандидатов:', error);
    throw new Error('Не удалось сохранить кандидатов.');
  }
};

// Основной POST запрос для сохранения кандидатов
export async function POST(req: NextRequest) {
  try {
    console.log('Начинаем обработку POST запроса для сохранения кандидатов.');

    await connectDB();
    console.log('Подключение к базе данных успешно выполнено.');

    const contentType = req.headers.get('Content-Type');

    if (contentType?.includes('application/json')) {
      console.log('Получаем данные из тела запроса (формат JSON).');

      const candidates = await req.json();  // Получаем данные из тела запроса (JSON)

      console.log(`Получено ${candidates.length} кандидатов для обработки.`);

      // Процесс преобразования каждого кандидата
      const transformedCandidates = candidates.map((candidate: any) => {
        // Логируем полученные данные кандидата
        console.log('Полученные данные кандидата:', candidate);
      
        // Преобразуем данные с правильными типами
        return {
          name: candidate.name,
          phone: candidate.phone,  // Используем правильный ключ
          status: candidate.status || 'не обработан',  // Если статус отсутствует, ставим 'не обработан'
          professions: candidate.professions ? [{
            name: candidate.professions, // Предполагаем, что professions передается как строка, преобразуем в объект
            expirience: ''  // У вас в схеме есть поле expirience для профессий, пока оставляем пустым
          }] : [], // Если professions нет, передаем пустой массив
          source: 'excel',  // Источник данных (например, excel)
          note: candidate.note ? String(candidate.note) : '',  // Преобразуем к строке, если нужно
          responsible: candidate.responsible ? String(candidate.responsible) : '',
          comment: candidate.comment ? [{
            author: 'admin', // Автор комментария (например, админ)
            text: candidate.comment,
            date: new Date(),
          }] : [],  // Если comment есть, передаем в виде массива с объектом
          messenger: candidate.messenger ? String(candidate.messenger) : '',  // Преобразуем к строке
        };
      });
      
      console.log('Преобразованные кандидаты:', transformedCandidates);
      

      // Сохраняем уникальных кандидатов
      const savedCandidates = await saveCandidates(transformedCandidates);

      if (savedCandidates.length > 0) {
        console.log('Кандидаты успешно сохранены в базу данных.');
        return NextResponse.json({ message: 'Кандидаты успешно сохранены', data: savedCandidates });
      } else {
        console.log('Нет уникальных кандидатов для сохранения.');
        return NextResponse.json({ message: 'Нет уникальных кандидатов для сохранения.' });
      }

    } else {
      console.log('Получен неподдерживаемый Content-Type. Ожидается application/json.');
      return NextResponse.json({ error: 'Unsupported Content-Type' }, { status: 415 });
    }

  } catch (error: any) {
    console.error('Ошибка обработки запроса:', error);
    return NextResponse.json({ error: 'Не удалось обработать запрос', details: error.message }, { status: 500 });
  }
}
