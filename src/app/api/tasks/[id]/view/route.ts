import { NextResponse } from 'next/server';
import Task from '@/src/models/Task'; // Импортируем модель Task

// Обработка PATCH запроса
export const PATCH = async (req: Request, { params }: { params: { taskId: string } }) => {
  const { taskId } = params; // Получаем taskId из параметров URL
console.log("Принятый ид задачи", taskId)
  try {
    // Найдем задачу по ID и обновим поле isViewed на true
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { isViewed: true }, // Обновляем поле isViewed
      { new: true } // Возвращаем обновленный документ
    );

    // Если задача не найдена, возвращаем 404
    if (!updatedTask) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    // Отправляем обновленную задачу в ответе
    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
};
