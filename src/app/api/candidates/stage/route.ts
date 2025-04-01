import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/db';  // Путь к твоей функции подключения к базе данных
import Stage from '@/src/models/Stage';  // Модель для коллекции stages
import Candidate from '@/src/models/Candidate';  // Модель для коллекции кандидатов

export const GET = async (request: NextRequest) => {
  try {
    console.time("API Request Time");  // Начинаем замер времени

    // Подключение к базе данных
    await connectDB();

    // Извлечение параметров запроса
    const { searchParams } = new URL(request.url);
    const stageId = searchParams.get('stageId');  // Получаем id этапа

    // Если stageId не передан, возвращаем ошибку
    if (!stageId) {
      return NextResponse.json({ error: 'Stage ID is required' }, { status: 400 });
    }

    // Получаем документ этапа из коллекции Stage
    const stage = await Stage.findById(stageId).populate({
      path: 'candidates',
      populate: [{
        path: 'manager',  
        select: 'name',
      },
      {
        path: 'events',
        select: ['eventType','description','comment', 'createdAt','manager', 'vacancy'],
      },
    ]
    })

    // Если этап не найден, возвращаем ошибку
    if (!stage) {
      return NextResponse.json({ error: 'Stage not found' }, { status: 404 });
    }

    // Возвращаем информацию о кандидатах
    return NextResponse.json(stage.candidates, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    console.timeEnd("API Request Time");  
  }
};

