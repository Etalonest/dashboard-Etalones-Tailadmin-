import { connectDB } from "@/src/lib/db";
import Stage from "@/src/models/Stage";


export const GET = async (request: Request) => {
  try {
    await connectDB();
    const stages = await Stage.find({})
    .sort({ 'createdAt': -1 })
    .populate({
      path: 'candidate',
      select: 'name', 
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
        select: ['title', 'location'],
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