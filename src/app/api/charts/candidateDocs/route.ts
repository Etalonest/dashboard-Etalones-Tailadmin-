// import { NextRequest, NextResponse } from 'next/server';
// import { connectDB } from '@/src/lib/db'; // Замените на реальный путь к вашему файлу подключения
// import Candidate from '@/src/models/Candidate'; // Замените на реальный путь к модели кандидата

// export const GET = async (request: NextRequest) => {
//     try {
//       await connectDB();
  
//       const { searchParams } = new URL(request.url);
//       const period = searchParams.get('period'); // Параметр для выбора периода (daily, weekly, monthly)
  
//       let dateFilter: any = {};
  
//       // Получаем текущую дату
//       const now = new Date();
  
//       // Логика фильтрации по периоду
//       if (period === 'daily') {
//         // Фильтрация по сегодняшней дате
//         const startOfDay = new Date(now.setHours(0, 0, 0, 0)); // Начало дня
//         dateFilter = { createdAt: { $gte: startOfDay } };
//       } else if (period === 'weekly') {
//         // Фильтрация по текущей неделе
//         const startOfWeek = now.getDate() - now.getDay(); // Начало недели
//         const endOfWeek = startOfWeek + 6; // Конец недели
//         const startOfWeekDate = new Date(now.setDate(startOfWeek));
//         const endOfWeekDate = new Date(now.setDate(endOfWeek));
//         dateFilter = { createdAt: { $gte: startOfWeekDate, $lte: endOfWeekDate } };
//       } else if (period === 'monthly') {
//         // Фильтрация по текущему месяцу
//         const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // Начало месяца
//         dateFilter = { createdAt: { $gte: startOfMonth } };
//       }
  
//       // Фильтрация по наличию manager
//       const candidates = await Candidate.find({
//         ...dateFilter,
//         manager: { $exists: true, $ne: null }, // Проверяем, что поле manager существует и не null
//       })
//         .populate(['documents']); // Для получения связанных данных
  
//       const response = {
//         candidates, // Возвращаем всех кандидатов, подходящих под фильтры
//       };
  
//       return new NextResponse(JSON.stringify(response), { status: 200 });
//     } catch (error) {
//       console.error("Error in fetching:", error);
//       return new NextResponse("Error in fetching: " + error, { status: 500 });
//     }
//   };
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/db'; // Замените на реальный путь к вашему файлу подключения
import Candidate from '@/src/models/Candidate'; // Замените на реальный путь к модели кандидата

export const GET = async (request: NextRequest) => {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period'); // Параметр для выбора периода (daily, weekly, monthly)

    let dateFilter: any = {};

    // Получаем текущую дату
    const now = new Date();

    // Логика фильтрации по периоду
    if (period === 'daily') {
      // Фильтрация по сегодняшней дате
      const startOfDay = new Date(now.setHours(0, 0, 0, 0)); // Начало дня
      dateFilter = { createdAt: { $gte: startOfDay } };
    } else if (period === 'weekly') {
      // Фильтрация по текущей неделе
      const startOfWeek = now.getDate() - now.getDay(); // Начало недели
      const endOfWeek = startOfWeek + 6; // Конец недели
      const startOfWeekDate = new Date(now.setDate(startOfWeek));
      const endOfWeekDate = new Date(now.setDate(endOfWeek));
      dateFilter = { createdAt: { $gte: startOfWeekDate, $lte: endOfWeekDate } };
    } else if (period === 'monthly') {
      // Фильтрация по текущему месяцу
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // Начало месяца
      dateFilter = { createdAt: { $gte: startOfMonth } };
    }

    // Фильтрация по наличию manager
    const candidates = await Candidate.find({
      ...dateFilter,
      manager: { $exists: true, $ne: null }, // Проверяем, что поле manager существует и не null
    })
      .populate(['documents']); // Для получения связанных данных

    // Статистика по документам
    const documentStats = new Map<string, number>();
    let candidatesWithNoDocuments = 0;

    candidates.forEach((candidate) => {
      if (candidate.documents.length === 0) {
        candidatesWithNoDocuments += 1; // Увеличиваем количество кандидатов без документов
      }
      candidate.documents.forEach((doc: string) => {
        documentStats.set(doc, (documentStats.get(doc) || 0) + 1); // Считаем количество каждого документа
      });
    });

    // Добавляем кандидатов без документов в статистику
    if (candidatesWithNoDocuments > 0) {
      documentStats.set('Без документов', candidatesWithNoDocuments);
    }

    // Формируем ответ с кандидатами и статистикой
    const response = {
      candidates, // Возвращаем всех кандидатов, подходящих под фильтры
      documentStats: Array.from(documentStats.entries()), // Преобразуем карту в массив для удобства отображения
      totalCandidates: candidates.length, // Количество кандидатов
    };

    return new NextResponse(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error('Error in fetching:', error);
    return new NextResponse('Error in fetching: ' + error, { status: 500 });
  }
};
