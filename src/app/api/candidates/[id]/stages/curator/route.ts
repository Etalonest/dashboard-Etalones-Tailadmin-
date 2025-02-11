// app/api/candidates/[candidateId]/stages/curator/route.js

import { connectDB } from '@/src/lib/db'; 
import Stage from '@/src/models/Stage';
import Candidate from '@/src/models/Candidate'; 
import Vacancies from '@/src/models/Vacancies'; 
import Task from '@/src/models/Task';
import Manager from '@/src/models/Manager';
import EventLog from '@/src/models/EventLog';
import { sendPushNotification } from '@/src/lib/pushNotifications'; 


export const POST = async (req: Request, { params }: any) => {
    const { id } = params;
  try {

    const formData = await req.formData();
    console.log("formData", formData);

    const status = formData.get('status') as string;
    const responsible = formData.get('responsible') as string; 
    const comment = formData.get('comment') as string;
    const vacancy = formData.get('vacancy') as string;
    const appointed = formData.get('appointed') as string;

    await connectDB();

    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return new Response(
        JSON.stringify({ error: 'Кандидат не найден' }),
        { status: 404 }
      );
    }

    const selectedVacancy = await Vacancies.findById(vacancy);
    if (!selectedVacancy) {
      return new Response(
        JSON.stringify({ error: 'Вакансия не найдена' }),
        { status: 404 }
      );
    }

    const newStage = new Stage({
      appointed: appointed, 
      stage: 'curator', 
      status: status, 
      candidate: id,
      responsible: responsible, 
      comment: comment, 
      vacancy: vacancy, 
    });

    await newStage.save();
    console.log("newStage", newStage);

    candidate.stages = newStage._id;
    await candidate.save();
    console.log("candidate", candidate);
    const newTask1 = new Task({
      appointed: appointed,
      taskName: 'Потвердить данные из анкеты', 
      description: 'Проговорить анкету с кандидатом чтоб он потвердил данные', 
      status: 'В процессе', 
      stage: newStage._id, 
      candidate: id, 
      assignedTo: responsible, 
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), 
    });
    
    await newTask1.save(); 
    
    const newTask2 = new Task({
      appointed: appointed,
      taskName: 'Передать на собеседование по выбраной вакансии',
      description: 'Передать на собеседование по выбраной вакансии, или предложить другую подходящую, в противном случае вернуть рекрутеру', 
      status: 'В процессе', 
      stage: newStage._id, 
      candidate: id, 
      assignedTo: responsible, 
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), 
    });
    
    await newTask2.save();
    if (id.manager) {
      const manager = await Manager.findById(id.manager);
      if (manager) {
        await Manager.findByIdAndUpdate(manager._id, { $addToSet: { candidates: id._id } });
      }
    }
    if (!newStage.tasks) {
      newStage.tasks = [];
    }
    newStage.tasks.push(newTask1._id, newTask2._id); 
    await newStage.save();
    const eventLog = new EventLog({
      eventType: 'Передан куратору',
      appointed: appointed,
      relatedId: candidate._id,
      manager: responsible,
      description: `Кандидат: ${candidate.name} передан куратору`,
    });
    console.log("EVENTLOG", eventLog)
    await eventLog.save();
    if (id.manager) {
      const manager = await Manager.findById(id.manager);
      if (manager && manager.pushSubscription) {
        const message = `Кандидат ${candidate.name} передан вам для дальнейшей работы.`;
        await sendPushNotification(manager._id, message);
      }
    }
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
