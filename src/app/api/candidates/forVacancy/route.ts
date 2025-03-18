// // src/app/api/candidates/forVacancy/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { connectDB } from '@/src/lib/db';
// import Candidate from '@/src/models/Candidate';
// import Vacancies from '@/src/models/Vacancies';

// export const GET = async (request: NextRequest) => {
//   try {
//     console.log('Запрос на получение кандидатов для вакансии поступил.');

//     // Подключение к базе данных
//     await connectDB();
//     console.log('Подключение к базе данных выполнено.');

//     // Получаем параметр vacancyId из URL
//     const { searchParams } = new URL(request.url);
//     const vacancyId = searchParams.get('vacancyId');
//     console.log('Получен параметр vacancyId:', vacancyId);

//     if (!vacancyId) {
//       console.error('Ошибка: отсутствует параметр vacancyId.');
//       return new NextResponse('vacancyId is required', { status: 400 });
//     }

//     // Получаем вакансию по ID
//     const vacancy = await Vacancies.findById(vacancyId);
//     console.log('Найденная вакансия:', vacancy);

//     if (!vacancy) {
//       console.error('Ошибка: вакансия не найдена для vacancyId:', vacancyId);
//       return new NextResponse('Vacancy not found', { status: 404 });
//     }

//     const profession = vacancy.title; // Профессия из вакансии
//     console.log('Профессия из вакансии:', profession);

//     // Поиск кандидатов по профессии
//     const candidates = await Candidate.find({
//       'professions.name': profession, // Ищем кандидатов по совпадению профессии
//     })
//     console.log('Найдено кандидатов:', candidates.length);

//     // Проверяем, если кандидаты найдены
//     if (candidates.length === 0) {
//       console.log('Не найдено кандидатов для вакансии:', vacancyId);
//       return new NextResponse('No candidates found for this vacancy', { status: 404 });
//     }

//     return new NextResponse(JSON.stringify({ candidates }), { status: 200 });
//   } catch (error: any) {
//     console.error('Ошибка при поиске кандидатов:', error);
//     return new NextResponse('Error fetching candidates: ' + error.message, { status: 500 });
//   }
// };
// src/app/api/candidates/forVacancy/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/db';
import Candidate from '@/src/models/Candidate';
import Vacancies from '@/src/models/Vacancies';

export const GET = async (request: NextRequest) => {
  try {
    console.log('Запрос на получение кандидатов для вакансии поступил.');

    // Подключение к базе данных
    await connectDB();
    console.log('Подключение к базе данных выполнено.');

    // Получаем параметр vacancyId из URL
    const { searchParams } = new URL(request.url);
    const vacancyId = searchParams.get('vacancyId');
    console.log('Получен параметр vacancyId:', vacancyId);

    if (!vacancyId) {
      console.error('Ошибка: отсутствует параметр vacancyId.');
      return new NextResponse('vacancyId is required', { status: 400 });
    }

    // Получаем вакансию по ID
    const vacancy = await Vacancies.findById(vacancyId);
    console.log('Найденная вакансия:', vacancy);

    if (!vacancy) {
      console.error('Ошибка: вакансия не найдена для vacancyId:', vacancyId);
      return new NextResponse('Vacancy not found', { status: 404 });
    }

    const profession = vacancy.title; // Профессия из вакансии
    console.log('Профессия из вакансии:', profession);

    // Поиск кандидатов по профессии с приведением строки к нижнему регистру
    const candidates = await Candidate.find({
      'professions.name': { $regex: new RegExp(`^${profession}$`, 'i') }, // Учитываем регистр
    }).sort({ updatedAt: -1 })
    .populate(['manager', 'tasks', 'stages', 'documents']);
    
    // Логирование найденных кандидатов
    console.log(`Найдено кандидатов с профессией ${profession}:`, candidates.length);

    // Проверяем, если кандидаты найдены
    if (candidates.length === 0) {
      console.log('Не найдено кандидатов для вакансии:', vacancyId);
      return new NextResponse('No candidates found for this vacancy', { status: 404 });
    }

    return new NextResponse(JSON.stringify({ candidates }), { status: 200 });
  } catch (error: any) {
    console.error('Ошибка при поиске кандидатов:', error);
    return new NextResponse('Error fetching candidates: ' + error.message, { status: 500 });
  }
};
