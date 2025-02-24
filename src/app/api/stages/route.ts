import { connectDB } from "@/src/lib/db";
import Stage from "@/src/models/Stage";


export const GET = async (request: Request) => {
  try {
    await connectDB();
    const stages = await Stage.find({stage: 'curator'})
    .sort({ 'createdAt': -1 })
    .populate({
      path: 'candidate',
      select: ['name','phone','ageNum','locations','citizenship', 'professions', 'documents','langue', 'drivePermis'], 
    })
    .populate({
      path: 'responsible',
      select: 'name', 
    })
    .populate({
        path: 'appointed',
        select: 'name',
    })
    .populate({
      path: 'vacancy',
      select: ['title', 'location', 'salary', 'homePrice', 'documents', 'tasks'],
      populate: {
        path: 'partner',  
        select: 'companyName',
      }
    })
    
    // .populate({
    //     path: 'vacancy',
    //     select: ['title', 'location', 'salary', 'homePrice', 'documents'],
    // })
    .populate({
      path: 'tasks',
      select: ['taskName','description','status'],
    })
    return new Response(JSON.stringify(stages), { status: 200 });
  } catch (error) {
    console.error("Ошибка при получении данных Задач:", error);
    return new Response(
      JSON.stringify({ message: "Ошибка при получении данных Задач" }),
      { status: 500 }
    );
  }
}