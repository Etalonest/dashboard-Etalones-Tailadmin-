// // // app/api/candidates/[candidateId]/stages/curator/route.js

// import { connectDB } from '@/src/lib/db'; 
// import Stage from '@/src/models/Stage';
// import Candidate from '@/src/models/Candidate'; 
// import Vacancies from '@/src/models/Vacancies'; 
// import Task from '@/src/models/Task';
// import Manager from '@/src/models/Manager';
// import EventLog from '@/src/models/EventLog';



// export const POST = async (req: Request, { params }: any) => {
//   const { id } = params;
// try {

//   const formData = await req.formData();
//   console.log("formData", formData);

//   const status = formData.get('status') as string;
//   const responsible = formData.get('responsible') as string; 
//   const comment = formData.get('comment') as string;
//   const vacancy = formData.get('vacancy') as string;
//   const appointed = formData.get('appointed') as string;
  
//   await connectDB();

//   const candidate = await Candidate.findById(id);
//   if (!candidate) {
//     return new Response(
//       JSON.stringify({ error: 'Кандидат не найден' }),
//       { status: 404 }
//     );
//   }

//   const selectedVacancy = await Vacancies.findById(vacancy);
//   if (!selectedVacancy) {
//     return new Response(
//       JSON.stringify({ error: 'Вакансия не найдена' }),
//       { status: 404 }
//     );
//   }

//   const newStage = new Stage({
//     appointed: appointed, 
//     stage: 'curator', 
//     status: status, 
//     candidate: id,
//     responsible: responsible, 
//     comment: comment, 
//     vacancy: vacancy, 
//   });

//   await newStage.save();
//   console.log("newStage", newStage);

//   candidate.stages = newStage._id;
//   candidate.manager = responsible;  
//   candidate.recruiter = appointed;
//   await candidate.save();
//   console.log("candidate", candidate);

  

//   const newTask1 = new Task({
//     isViewed: false,
//     appointed: appointed,
//     taskName: 'Потвердить данные из анкеты', 
//     description: 'Проговорить анкету с кандидатом чтоб он потвердил данные', 
//     status: 'В процессе', 
//     stage: newStage._id, 
//     candidate: id, 
//     assignedTo: responsible, 
//     dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), 
//   });
  
//   await newTask1.save(); 
  
//   const newTask2 = new Task({
//     isViewed: false,
//     appointed: appointed,
//     taskName: 'Передать на собеседование по выбраной вакансии',
//     description: 'Передать на собеседование по выбраной вакансии, или предложить другую подходящую, в противном случае вернуть рекрутеру', 
//     status: 'В процессе', 
//     stage: newStage._id, 
//     candidate: id, 
//     assignedTo: responsible, 
//     vacancy: vacancy,
//     dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), 
//   });
  
//   await newTask2.save();
  
//   const updatedVacancy = await Vacancies.findByIdAndUpdate(vacancy, {
//     $addToSet: { iterviews: id }
//   }, { new: true });  // Это вернет обновленный документ
//   console.log("Updated Vacancy:", updatedVacancy);  // Логируем обновленную вакансию
  
  

//   if (!updatedVacancy) {
//     return new Response(
//       JSON.stringify({ error: 'Не удалось обновить вакансии' }),
//       { status: 500 }
//     );
//   }

//   if (id.manager) {
//     const manager = await Manager.findById(id.manager);
//     if (manager) {
//       await Manager.findByIdAndUpdate(manager._id, { $addToSet: { candidatesFromRecruiter: id._id } });
//     }
//   }

//   if (!newStage.tasks) {
//     newStage.tasks = [];
//   }
//   newStage.tasks.push(newTask1._id, newTask2._id); 
//   await newStage.save();

//   const eventLog = new EventLog({
//     eventType: 'Передан куратору',
//     appointed: appointed,
//     relatedId: candidate._id,
//     manager: responsible,
//     description: `Кандидат: ${candidate.name} передан куратору`,
//   });
//   console.log("EVENTLOG", eventLog);
//   await eventLog.save();

//   const manager = await Manager.findById(responsible);
//   if (manager) {
//     manager.tasks.push(newTask1._id, newTask2._id);
//     manager.candidatesFromRecruiter.push(candidate._id);
//     manager.candidates.push(candidate._id);
//     await manager.save();
//   }

//   return new Response(
//     JSON.stringify({
//       message: 'Этап куратор успешно добавлен',
//       candidate: { id: id, name: candidate.name },
//       stage: newStage,
//     }),
//     { status: 201 }
//   );
// } catch (error) {
//   console.error('Ошибка при добавлении этапа:', error);
//   return new Response(
//     JSON.stringify({ error: 'Ошибка при добавлении этапа' }),
//     { status: 500 }
//   );
// }
// }
import { connectDB } from '@/src/lib/db'; 
import Stage from '@/src/models/Stage';
import Candidate from '@/src/models/Candidate'; 
import Vacancies from '@/src/models/Vacancies'; 
import Task from '@/src/models/Task';
import Manager from '@/src/models/Manager';
import EventLog from '@/src/models/EventLog';

export const POST = async (req: Request, { params }: any) => {
  const { id } = params;

  try {
    // Получаем данные из формы
    const formData = await req.formData();
    const status = formData.get('status') as string;
    const responsible = formData.get('responsible') as string;
    const comment = formData.get('comment') as string;
    const vacancy = formData.get('vacancy') as string;
    const appointed = formData.get('appointed') as string;
  
    // Подключаемся к базе данных
    await connectDB();

    // Находим кандидата по ID
    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return new Response(JSON.stringify({ error: 'Кандидат не найден' }), { status: 404 });
    }

    // Получаем ID текущей стадии кандидата из переменной окружения
    const stageId = process.env.NEXT_PUBLIC_CANDIDATES_STAGE_ON_INTERVIEW;
    
    // Находим стадию по ID из переменной окружения
    const currentStage = await Stage.findById(stageId).populate('candidates');
    if (!currentStage) {
      return new Response(JSON.stringify({ error: 'Стадия не найдена' }), { status: 404 });
    }

    // Удаляем кандидата из текущей стадии
    currentStage.candidates = currentStage.candidates.filter(
      (c: any) => c._id.toString() !== id
    );
    await currentStage.save();

    // Переносим кандидата на новую стадию (например, "На собеседовании")
    const newStage = await Stage.findById(stageId);  // Используем стадию из env
    if (!newStage) {
      return new Response(JSON.stringify({ error: 'Новая стадия не найдена' }), { status: 404 });
    }

    // Добавляем кандидата в новую стадию
    newStage.candidates.push(candidate._id);
    await newStage.save();

    // Обновляем статус кандидата
    candidate.status = status;
    candidate.manager = responsible;  // Обновляем менеджера кандидата
    await candidate.save();

    // Создаем задачи для ответственного менеджера
    const task1 = new Task({
      taskName: 'Подтвердить данные из анкеты',
      description: 'Проговорить анкету с кандидатом',
      assignedTo: responsible,
      appointed: appointed,
      stage: newStage._id,
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    await task1.save();

    const task2 = new Task({
      taskName: 'Передать на собеседование',
      description: 'Передать на собеседование по выбранной вакансии',
      appointed: appointed,
      assignedTo: responsible,
      stage: newStage._id,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    });
    await task2.save();

    // Создаем запись в EventLog
    const eventLog = new EventLog({
      eventType: 'Перемещение кандидата',
      appointed,
      relatedId: candidate._id,
      manager: responsible,
      description: `Кандидат: ${candidate.name} перемещен на стадию "На собеседовании"`,
    });
    await eventLog.save();

    // Логируем все операции
    console.log('Event log:', eventLog);
    console.log('Updated candidate:', candidate);

    return new Response(
      JSON.stringify({
        message: 'Кандидат успешно перемещен на собеседование',
        candidate: { id: candidate._id, name: candidate.name },
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
};
