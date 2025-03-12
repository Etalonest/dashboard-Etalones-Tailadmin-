// import { NextResponse } from 'next/server';
// import mongoose from 'mongoose';
// import Task from '@/src/models/Task';
// import EventLog from '@/src/models/EventLog';

// export async function PATCH(request: Request, { params }: { params: { id: string } }) {
//     try {
//       const { id } = params;
  
//       // Получаем данные из тела запроса
//       const { status } = await request.json();
  
//       // Проверка статуса
//       if (!status || !['выполнена', 'не-выполнена', 'отменено'].includes(status)) {
//         return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
//       }
  
//       // Проверяем, является ли ID валидным ObjectId
//       if (!mongoose.isValidObjectId(id)) {
//         return NextResponse.json({ message: 'Invalid task ID' }, { status: 400 });
//       }
  
//       // Находим задачу по ID
//       const task = await Task.findById(id);
//       if (!task) {
//         console.log('Task not found for ID:', id); // Логируем, если задача не найдена
//         return NextResponse.json({ message: 'Task not found' }, { status: 404 });
//       }
  
//       // Обновляем статус задачи
//       task.status = status;
//       await task.save();
      
//       const eventLog = new EventLog({
//         eventType: 'Выполнена задача',
//         relatedId: task.candidate._id,
//         manager: task.assignedTo,
//         description: `Выполнена поставленая задача: ${task.taskName}`,
//       });
//       console.log("EVENTLOG", eventLog)
//       await eventLog.save();

//       return NextResponse.json({ message: 'Task updated successfully', task });
//     } catch (error) {
//       console.error('Error updating task:', error);
//       return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//     }
//   }
  
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Task from '@/src/models/Task';
import EventLog from '@/src/models/EventLog';
import Vacancies from '@/src/models/Vacancies';

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
    const task = await Task.findById(id)
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

      // Добавляем кандидата в массив "interviews" вакансии, если его там еще нет
      if (!vacancy.interviews.includes(task.candidate._id)) {
        vacancy.interviews.push(task.candidate._id);
        await vacancy.save();

        // Логируем событие, что кандидат передан на собеседование
        const eventLog = new EventLog({
          eventType: 'Передан на собеседование',
          relatedId: task.candidate._id,
          manager: task.assignedTo,
          description: `Кандидат ${task.candidate.name} передан на собеседование для вакансии ${vacancy.title}`,
        });
        await eventLog.save();
      }
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
    console.log("EVENTLOG", eventLog);
    await eventLog.save();

    return NextResponse.json({ message: 'Task updated successfully', task });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
  
  
