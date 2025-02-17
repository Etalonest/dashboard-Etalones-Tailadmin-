import { connectDB } from "@/src/lib/db";
import Candidate from "@/src/models/Candidate";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    await connectDB();

    // Получаем параметры запроса для пагинации
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');  // Страница, по умолчанию 1
    const limit = parseInt(url.searchParams.get('limit') || '20'); // Лимит на количество кандидатов, по умолчанию 10

    const skip = (page - 1) * limit; // Сколько кандидатов нужно пропустить, чтобы начать с нужной страницы

    // Получаем только кандидатов, у которых private: false
    const candidates = await Candidate.find({ private: false })
      .sort({ 'updatedAt': -1 }) // Сортировка по обновлению
      .skip(skip) // Пропускаем нужное количество
      .limit(limit) // Ограничиваем результат количеством кандидатов
      .populate(['manager', 'stages']); // Заполняем данные о менеджере и стадиях

    // Получаем общее количество кандидатов
    const totalCandidates = await Candidate.countDocuments({ private: false });

    // Ответ с пагинацией
    const response = {
      candidates,
      totalCandidates,
      totalPages: Math.ceil(totalCandidates / limit),  // Общее количество страниц
      currentPage: page,
    };

    return new NextResponse(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error("Error in fetching:", error);
    return new NextResponse("Error in fetching: " + error, { status: 500 });
  }
};
