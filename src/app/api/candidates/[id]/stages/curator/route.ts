// app/api/candidates/[candidateId]/stages/curator/route.js

import { connectDB } from '@/src/lib/db'; 
import Stage from '@/src/models/Stage';
import Candidate from '@/src/models/Candidate'; 
import Vacancies from '@/src/models/Vacancies'; 

export const POST = async (req: Request, { params }: any) => {
    const { id } = params;
  try {

    // Получаем данные формы
    const formData = await req.formData();
    console.log("formData", formData);

    // Чтение полей формы
    const status = formData.get('status') as string;
    const responsible = formData.get('responsible') as string; // Ответственный (менеджер)
    const comment = formData.get('comment') as string;
    const vacancy = formData.get('vacancy') as string;

    await connectDB();

    // Проверяем, существует ли кандидат
    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return new Response(
        JSON.stringify({ error: 'Кандидат не найден' }),
        { status: 404 }
      );
    }

    // Проверяем, существует ли вакансия
    const selectedVacancy = await Vacancies.findById(vacancy);
    if (!selectedVacancy) {
      return new Response(
        JSON.stringify({ error: 'Вакансия не найдена' }),
        { status: 404 }
      );
    }

    // Создаем новый этап для кандидата
    const newStage = new Stage({
      stage: 'curator', // Указываем этап
      status: status, // Статус
      candidate: id, // ID кандидата
      responsible: responsible, // ID ответственного (менеджера)
      comment: comment, // Комментарий
      vacancy: vacancy, // ID вакансии
    });

    // Сохраняем этап в базе данных
    await newStage.save();
    console.log("newStage", newStage);

    // Обновляем кандидата, добавляем ссылку на новый этап
    candidate.lastStage = newStage._id;
    await candidate.save();

    return new Response(
      JSON.stringify({
        message: 'Этап куратор успешно добавлен',
        candidate: { id: id, name: candidate.name },
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
