import { connectDB } from '@/src/lib/db'; 
import Candidate from '@/src/models/Candidate'; 
import Interview from '@/src/models/Interview'; 
import EventLog from '@/src/models/EventLog';

export const PATCH = async (req: Request, { params }: any) => {
  const { id } = params;
  try {
    // Извлекаем данные из JSON тела запроса
    const formData = await req.json(); 
    const { status, author, comment, date } = formData; // Деструктурируем полученные данные

    // Логируем данные, которые получаем
    console.log('Полученные данные:', {
      status,
      author,
      comment,
      date
    });

    await connectDB();

    // Находим кандидата по ID
    const candidate = await Candidate.findById(id);
    if (!candidate) {
      console.log(`Кандидат с id ${id} не найден`); 
      return new Response(
        JSON.stringify({ error: 'Кандидат не найден' }),
        { status: 404 }
      );
    }

    // Проверяем, есть ли интервью у кандидата
    if (!candidate.interviews || candidate.interviews.length === 0) {
      console.log(`У кандидата с id ${id} нет интервью`);
      return new Response(
        JSON.stringify({ error: 'У кандидата нет интервью' }),
        { status: 404 }
      );
    }

    // Берем первое интервью из массива интервью кандидата
    const firstInterview = candidate.interviews[0];

    // Логируем, какое интервью мы нашли
    console.log('Первое интервью кандидата:', firstInterview);

    // Находим интервью в базе
    const interview = await Interview.findById(firstInterview);
    if (!interview) {
      console.log(`Интервью с id ${firstInterview} не найдено`);
      return new Response(
        JSON.stringify({ error: 'Интервью не найдено' }),
        { status: 404 }
      );
    }

    // Логируем перед обновлением
    console.log('Интервью до обновления:', interview);

    // Обновляем статус интервью и комментарий
    interview.status = status;
    interview.comment = comment || interview.comment; // Если комментарий был передан, обновляем его
    if (status === 'Прошёл' && date) {
      interview.comment = `Дата выезда: ${date}`;
    }

    // Сохраняем обновленное интервью
    await interview.save();

    // Логируем, что интервью сохранено
    console.log('Интервью после обновления:', interview);

    // Создаем лог события
    const eventLog = new EventLog({
      eventType: 'Обновление статуса интервью',
      manager: author, // Автор, который обновил
      relatedId: candidate._id,
      description: `Кандидат "${candidate.name}" ${status} собеседование`,
    });
    await eventLog.save();

    // Логируем успешное создание события
    console.log('Событие успешно записано:', eventLog);

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
    // Логируем ошибку, если она произошла
    console.error('Ошибка при обновлении статуса интервью:', error);

    return new Response(
      JSON.stringify({ error: 'Ошибка при обновлении статуса интервью' }),
      { status: 500 }
    );
  }
};
