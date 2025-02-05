// app/api/candidates/[candidateId]/stages/curator/route.js

import { connectDB } from '@/src/lib/db'; 
import Stage from '@/src/models/Stage';
import Candidate from '@/src/models/Candidate'; 

export async function POST(req : any, { params }: any) {
  try {
    const { candidateId } = params; // Получаем ID кандидата из URL
    const { status, responsible, comment, vacancy } = await req.json(); // Получаем данные из тела запроса

    // Подключаемся к базе данных
    await connectDB();

    // Проверяем, существует ли кандидат
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return new Response(
        JSON.stringify({ error: 'Кандидат не найден' }),
        { status: 404 }
      );
    }

    // Создаем новый этап для кандидата
    const newStage = new Stage({
      stage: 'curator', // Указываем этап
      status: status, // Статус
      candidate: candidateId, // ID кандидата
      responsible: responsible, // Ответственный
      comment: comment, // Комментарий
      vacancy: vacancy, // Вакансия
    });
 
    // Сохраняем этап в базе данных
    await newStage.save();

    // Обновляем кандидата, добавляем ссылку на новый этап
    candidate.lastStage = newStage._id;
    await candidate.save();

    return new Response(
      JSON.stringify({
        message: 'Этап куратор успешно добавлен',
        candidate: { id: candidateId, name: candidate.name },
        stage: newStage,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Ошибка при добавлении этапа:', error);
    return new Response(
      JSON.stringify({ error: 'Ошибка при добавлении этапа' }),
      { status: 500 }
    );
  }
}
