import { connectDB } from '@/src/lib/db'; 
import Candidate from '@/src/models/Candidate'; 
import Interview from '@/src/models/Interview'; // Модель для интервью
import Manager from '@/src/models/Manager'; 
import EventLog from '@/src/models/EventLog';

export const POST = async (req: Request, { params }: any) => {
  const { id } = params;
  try {
    // Извлекаем данные из формы
    const formData = await req.formData();
    const status = formData.get('status') as string;
    const author = formData.get('author') as string; // Взяли автора из формы (пользователь, кто меняет статус)
    
    await connectDB();

    // Находим кандидата по ID
    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return new Response(
        JSON.stringify({ error: 'Кандидат не найден' }),
        { status: 404 }
      );
    }

    // Проверяем, есть ли интервью у кандидата
    if (!candidate.interviews || candidate.interviews.length === 0) {
      return new Response(
        JSON.stringify({ error: 'У кандидата нет интервью' }),
        { status: 404 }
      );
    }

    // Берем первое интервью из массива интервью кандидата
    const firstInterview = candidate.interviews[0];

    // Находим интервью в базе
    const interview = await Interview.findById(firstInterview);
    if (!interview) {
      return new Response(
        JSON.stringify({ error: 'Интервью не найдено' }),
        { status: 404 }
      );
    }

    // Обновляем статус интервью
    interview.status = status;
    interview.comment = formData.get('comment') as string || interview.comment; // Если комментарий был передан, обновляем его

    // Сохраняем обновленное интервью
    await interview.save();

    // Обновляем кандидат в базе данных (при необходимости)
    candidate.interviews[0] = interview._id; // В случае необходимости это можно настроить для дальнейших операций
    await candidate.save();

    // Создаем лог события
    const eventLog = new EventLog({
      eventType: 'Обновление статуса интервью',
      manager: author, // Автор, который обновил
      relatedId: candidate._id,
      description: `Статус интервью кандидата "${candidate.name}" изменен на "${status}"`,
    });
    await eventLog.save();

    // Отправляем успешный ответ
    return new Response(
      JSON.stringify({
        message: 'Статус интервью обновлен',
        candidate: { id: candidate._id, name: candidate.name },
        interview: interview,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка при обновлении статуса интервью:', error);
    return new Response(
      JSON.stringify({ error: 'Ошибка при обновлении статуса интервью' }),
      { status: 500 }
    );
  }
};
