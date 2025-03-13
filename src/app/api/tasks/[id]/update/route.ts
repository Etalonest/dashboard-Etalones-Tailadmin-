// import { NextResponse } from 'next/server';
// import mongoose from 'mongoose';
// import Task from '@/src/models/Task';
// import EventLog from '@/src/models/EventLog';
// import Vacancies from '@/src/models/Vacancies';
// import Candidate from '@/src/models/Candidate';
// import Interview from '@/src/models/Interview';
// import Manager from '@/src/models/Manager';

// export async function PATCH(request: Request, { params }: { params: { id: string } }) {
//   try {
//     const { id } = params;

//     // Получаем данные из тела запроса
//     const { status } = await request.json();

//     // Проверка статуса
//     if (!status || !['выполнена', 'не-выполнена', 'отменено'].includes(status)) {
//       return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
//     }

//     // Проверяем, является ли ID валидным ObjectId
//     if (!mongoose.isValidObjectId(id)) {
//       return NextResponse.json({ message: 'Invalid task ID' }, { status: 400 });
//     }

//     // Находим задачу по ID
//     const task = await Task.findById(id);
//     if (!task) {
//       console.log('Task not found for ID:', id); // Логируем, если задача не найдена
//       return NextResponse.json({ message: 'Task not found' }, { status: 404 });
//     }

//     // Проверяем, является ли задача с именем "Передать на собеседование по выбранной вакансии"
//     if (task.taskName === 'Передать на собеседование по выбраной вакансии' && status === 'выполнена') {

//       // Находим вакансию
//       const vacancy = await Vacancies.findById(task.vacancy);
//       if (!vacancy) {
//         return NextResponse.json({ message: 'Vacancy not found' }, { status: 404 });
//       }

//       // Создаем новое интервью
//       const newInterview = new Interview({
//         status: 'назначено', 
//         vacancy: task.vacancy,
//         manager: task.assignedTo,
//         candidate: task.candidate._id,
//         date: new Date(), 
//         comment: task.comment || '', 
//       });

//       // Сохраняем интервью
//       await newInterview.save();

//       // Добавляем ID интервью в массив "interviews" вакансии
//       if (!vacancy.interviews.includes(newInterview._id)) {
//         vacancy.interviews.push(newInterview._id);
//         await vacancy.save();
//       }

//       // Находим кандидата и добавляем ID интервью
//       const candidate = await Candidate.findById(task.candidate._id);
//       if (!candidate) {
//         return NextResponse.json({ message: 'Candidate not found' }, { status: 404 });
//       }

//       // Добавляем новое интервью в массив "interviews" кандидата
//       candidate.interviews.push(newInterview._id);
//       const statusWorkUpdate = {
//         name: 'На собеседовании',
//         date: new Date(),
//       };
//       candidate.statusWork.push(statusWorkUpdate);
//       // Обновляем данные кандидата

//       await candidate.save();

//       // Логируем событие, что кандидат передан на собеседование
//       const eventLog = new EventLog({
//         eventType: 'Передан на собеседование',
//         relatedId: task.candidate._id,
//         manager: task.assignedTo,
//         description: `Кандидат ${task.candidate.name} передан на собеседование для вакансии ${vacancy.title}`,
//       });
//       await eventLog.save();
//     }

//     // Обновляем статус задачи
//     task.status = status;
//     await task.save();

//     // Логируем выполнение задачи
//     const eventLog = new EventLog({
//       eventType: 'Выполнена задача',
//       relatedId: task.candidate._id,
//       manager: task.assignedTo,
//       description: `Выполнена поставленая задача: ${task.taskName}`,
//     });
//     console.log('EVENTLOG', eventLog);
//     await eventLog.save();

//     const manager = await Manager.findById(task.assignedTo);
//     if (!manager) {
//       return NextResponse.json({ message: 'Manager not found' }, { status: 404 });
//     }
    
//     manager.candidateFromInterview = manager.candidateFromInterview || [];
//     manager.candidateFromInterview.push(task.candidate._id);

//     await Manager.updateOne(
//       { _id: task.assignedTo },
//       { $pull: { candidatesFromRecruiter: task.candidate._id } }
//     );
    
//     await manager.save(); 
       
//     return NextResponse.json({ message: 'Task updated successfully', task });
//   } catch (error) {
//     console.error('Error updating task:', error);
//     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//   }
// }
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Task from '@/src/models/Task';
import EventLog from '@/src/models/EventLog';
import Vacancies from '@/src/models/Vacancies';
import Candidate from '@/src/models/Candidate';
import Interview from '@/src/models/Interview';
import Manager from '@/src/models/Manager';

const updateManagerCandidates = async (managerId: string, candidateId: string) => {
  const manager = await Manager.findById(managerId);
  if (!manager) {
    throw new Error(`Manager with id ${managerId} not found`);
  }

  // Инициализируем массив, если он еще не существует
  manager.candidateFromInterview = manager.candidateFromInterview || [];
  manager.candidateFromInterview.push(candidateId);

  // Удаляем кандидата из массива recruiters
  await Manager.updateOne(
    { _id: managerId },
    { $pull: { candidatesFromRecruiter: candidateId } }
  );

  // Сохраняем изменения
  await manager.save();
};

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Получаем данные из тела запроса
    const { status } = await request.json();

    // Проверка статуса
    if (!status || !['выполнена', 'не-выполнена', 'отменено'].includes(status)) {
      return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
    }

    // Проверяем, является ли ID валидным ObjectId
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ message: 'Invalid task ID' }, { status: 400 });
    }

    // Находим задачу по ID
    const task = await Task.findById(id);
    if (!task) {
      console.log('Task not found for ID:', id); // Логируем, если задача не найдена
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    // Проверяем, является ли задача с именем "Передать на собеседование по выбранной вакансии"
    if (task.taskName === 'Передать на собеседование по выбраной вакансии' && status === 'выполнена') {

      // Находим вакансию
      const vacancy = await Vacancies.findById(task.vacancy);
      if (!vacancy) {
        return NextResponse.json({ message: 'Vacancy not found' }, { status: 404 });
      }

      // Создаем новое интервью
      const newInterview = new Interview({
        status: 'назначено', 
        vacancy: task.vacancy,
        manager: task.assignedTo,
        candidate: task.candidate._id,
        date: new Date(), 
        comment: task.comment || '', 
      });

      // Сохраняем интервью
      await newInterview.save();

      // Добавляем ID интервью в массив "interviews" вакансии
      if (!vacancy.interviews.includes(newInterview._id)) {
        vacancy.interviews.push(newInterview._id);
        await vacancy.save();
      }

      // Находим кандидата и добавляем ID интервью
      const candidate = await Candidate.findById(task.candidate._id);
      if (!candidate) {
        return NextResponse.json({ message: 'Candidate not found' }, { status: 404 });
      }

      // Добавляем новое интервью в массив "interviews" кандидата
      candidate.interviews.push(newInterview._id);
      const statusWorkUpdate = {
        name: 'На собеседовании',
        date: new Date(),
      };
      candidate.statusWork.push(statusWorkUpdate);
      // Обновляем данные кандидата
      await candidate.save();

      // Логируем событие, что кандидат передан на собеседование
      const eventLog = new EventLog({
        eventType: 'Передан на собеседование',
        relatedId: task.candidate._id,
        manager: task.assignedTo,
        description: `Кандидат ${task.candidate.name} передан на собеседование для вакансии ${vacancy.title}`,
      });
      await eventLog.save();
    }

    // Обновляем статус задачи
    task.status = status;
    await task.save();

    // Логируем выполнение задачи
    const eventLog = new EventLog({
      eventType: 'Выполнена задача',
      relatedId: task.candidate._id,
      manager: task.assignedTo,
      description: `Выполнена поставленая задача: ${task.taskName}`,
    });
    console.log('EVENTLOG', eventLog);
    await eventLog.save();

    // Обновление кандидатов для обоих менеджеров
    await updateManagerCandidates(task.assignedTo, task.candidate._id);  // Первый менеджер
    await updateManagerCandidates(task.appointed, task.candidate._id);  // Второй менеджер

    return NextResponse.json({ message: 'Task updated successfully', task });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
