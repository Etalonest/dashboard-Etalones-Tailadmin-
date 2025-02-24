import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Task from '@/src/models/Task';
import EventLog from '@/src/models/EventLog';

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
  
      // Обновляем статус задачи
      task.status = status;
      await task.save();
      
      const eventLog = new EventLog({
        eventType: 'Выполнена задача',
        relatedId: task.candidate._id,
        manager: task.assignedTo,
        description: `Выполнена поставленая задача: ${task.taskName}`,
      });
      console.log("EVENTLOG", eventLog)
      await eventLog.save();

      return NextResponse.json({ message: 'Task updated successfully', task });
    } catch (error) {
      console.error('Error updating task:', error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }
  
  
  
