import { connectDB } from '@/src/lib/db';
import Stage from '@/src/models/Stage';
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: any) {
  const managerId = params; // Правильный способ получения ID менеджера из параметров
  const stageId = process.env.NEXT_PUBLIC_CANDIDATES_STAGE_ALL; // Получаем ID стадии из переменной окружения
  try {
    // Проверяем, что переменная окружения для stageId не пуста
    if (!stageId) {
      return NextResponse.json({ message: 'Stage ID not found in environment variables' }, { status: 400 });
    }

    // Подключаемся к базе данных
    await connectDB();

    // Ищем документ в коллекции stages по stageId
    const stage = await Stage.findById(stageId);

    console.log("STAGE", stage)
    if (!stage) {
      return NextResponse.json({ message: 'Stage not found' }, { status: 404 });
    }

    // Логируем ID менеджера
    console.log("Manager ID:", managerId);

    // Фильтруем кандидатов по managerId
    const filteredCandidates = stage.candidates.filter(
      (candidate: any) => candidate.manager === managerId
    );

    // Логируем список ID кандидатов
    const candidateIds = filteredCandidates.map((candidate: any) => candidate._id);
    console.log("Filtered candidate IDs:", candidateIds);

    // Возвращаем отфильтрованных кандидатов
    return NextResponse.json(filteredCandidates);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
