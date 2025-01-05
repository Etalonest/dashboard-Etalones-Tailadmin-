import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/db';  // Подключение к базе данных
import Candidate from '@/src/models/Candidate';  // Модель кандидата

export const GET = async (request: NextRequest) => {
  try {
    // Подключаемся к базе данных
    await connectDB();

    // Получаем параметр month из URL
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month'); // Параметр месяца, например "2025-01"

    if (!month) {
      return new NextResponse("Month parameter is required", { status: 400 });
    }

    // Создаем startDate и endDate на основе переданного месяца
    const startDate = new Date(`${month}-01T00:00:00Z`);
    const endDate = new Date(new Date(startDate).setMonth(startDate.getMonth() + 1));

    // Получаем количество дней в месяце
    const daysInMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();

    // Агрегируем кандидатов по дням месяца
    const candidatesAggregation = await Candidate.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $project: {
          day: { $dayOfMonth: "$createdAt" },  // Извлекаем день месяца
        },
      },
      {
        $group: {
          _id: "$day",  // Группируем по дню месяца
          count: { $sum: 1 },  // Считаем количество кандидатов в каждый день
        },
      },
      {
        $sort: { _id: 1 },  // Сортируем по дню месяца
      },
    ]);

    // Массив для хранения количества кандидатов для каждого дня месяца (1-31)
    const candidateCounts = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1; // День месяца (с 1)
      const dayData = candidatesAggregation.find((item: any) => item._id === day);
      return dayData ? dayData.count : 0;  // Если данных нет, возвращаем 0
    });

    // Отправляем данные для графика
    return new NextResponse(JSON.stringify({ days: Array.from({ length: daysInMonth }, (_, i) => i + 1), candidateCounts }), { status: 200 });
  } catch (error) {
    console.error("Error in fetching:", error);
    return new NextResponse("Error in fetching candidates", { status: 500 });
  }
};
