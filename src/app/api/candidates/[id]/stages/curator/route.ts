// app/api/candidates/[candidateId]/stages/curator/route.js

import { connectDB } from '@/src/lib/db'; 
import Stage from '@/src/models/Stage';
import Candidate from '@/src/models/Candidate'; 
import Vacancies from '@/src/models/Vacancies'; 
import Task from '@/src/models/Task';
import Manager from '@/src/models/Manager';


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

    await newStage.save();
    console.log("newStage", newStage);

    candidate.stages = newStage._id;
    await candidate.save();
    console.log("candidate", candidate);
    const newTask1 = new Task({
      taskName: 'Потвердить данные из анкеты', // Название задачи
      description: 'Проговорить анкету с кандидатом чтоб он потвердил данные', // Описание задачи
      status: 'in-progress', // Статус задачи
      stage: newStage._id, // Связь с этапом
      candidate: id, // Связь с кандидатом
      assignedTo: responsible, // Менеджер, ответственный за задачу
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Дата выполнения задачи (через 1 день)
    });
    
    await newTask1.save(); // Сохраняем задачу 1
    
    // Задача 2: Подбор вакансии
    const newTask2 = new Task({
      taskName: 'Потвердить данные указаные в анкете', 
      description: 'Передать на собеседование по выбраной вакансии', // Описание
      status: 'in-progress', // Статус задачи
      stage: newStage._id, // Связь с этапом
      candidate: id, // Связь с кандидатом
      assignedTo: responsible, // Менеджер, ответственный за задачу
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Дата выполнения задачи (через 2 дня)
    });
    
    await newTask2.save();
    // Если у кандидата есть менеджер, обновляем его список кандидатов
    if (id.manager) {
      const manager = await Manager.findById(id.manager);
      if (manager) {
        await Manager.findByIdAndUpdate(manager._id, { $addToSet: { candidates: id._id } });
      }
    }
    if (!newStage.tasks) {
      newStage.tasks = [];
    }
    newStage.tasks.push(newTask1._id, newTask2._id); // Добавляем ID задач
    await newStage.save();
console.log("newStage", newStage?.tasks);

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
