import { connectDB } from '@/src/lib/db'; 
import Stage from '@/src/models/Stage';
import Candidate from '@/src/models/Candidate'; 
import EventLog from '@/src/models/EventLog';

export const POST = async (req: Request, { params }: any) => {
  const { id } = params;

  try {
    // Подключаемся к базе данных
    await connectDB();

    // Находим кандидата по ID
    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return new Response(JSON.stringify({ error: 'Кандидат не найден' }), { status: 404 });
    }

    // Получаем список всех стадий
    const stages = await Stage.find({ name: { $nin: ['В ЧС', 'Удалённые'] } }).populate('candidates');
    if (stages.length === 0) {
      return new Response(JSON.stringify({ error: 'Не найдены стадии для изменения' }), { status: 404 });
    }

    // Убираем кандидата из всех стадий, кроме "В ЧС" и "Удалённые"
    for (let stage of stages) {
      stage.candidates = stage.candidates.filter((c: any) => c._id.toString() !== id);
      await stage.save();
    }

    // Находим стадию "Удалённые"
    const deletedStage = await Stage.findOne({ name: 'В ЧС' });
    if (deletedStage) {
      // Если такая стадия есть, добавляем кандидата в массив "Удалённые"
      deletedStage.candidates.push(candidate._id);
      await deletedStage.save();
    } else {
      // Если стадии "Удалённые" нет, создаём новую
      const newDeletedStage = new Stage({
        name: 'Удалённые',
        candidates: [candidate._id],
      });
      await newDeletedStage.save();
    }

    // Создаем запись в EventLog
    const eventLog = new EventLog({
      eventType: 'Кандидат добавлен в ЧС',
      relatedId: candidate._id,
      description: `Кандидат: ${candidate.name} был перемещён в "Чёрный список"`,
    });
    await eventLog.save();

    // Логируем все операции
    console.log('Event log:', eventLog);
    console.log('Updated candidate:', candidate);

    return new Response(
      JSON.stringify({
        message: 'Кандидат успешно перемещён в "ЧС"',
        candidate: { id: candidate._id, name: candidate.name },
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Ошибка при перемещении в ЧС кандидата:', error);
    return new Response(
      JSON.stringify({ error: 'Ошибка при удалении кандидата' }),
      { status: 500 }
    );
  }
};
