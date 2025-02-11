import { connectDB } from "@/src/lib/db";
import EventLog from "@/src/models/EventLog";

export const GET = async (request: Request) => {
  try {
    await connectDB();
    const eventLogs = await EventLog.find({})
    .sort({ 'createdAt': -1 })
    .populate({
      path: 'manager',
      select: 'name', 
    })
    .populate({
      path: 'relatedId',
      select: 'name', 
    })
    .populate({
      path: 'appointed',
      select: 'name', 
    })
    return new Response(JSON.stringify(eventLogs), { status: 200 });
  } catch (error) {
    console.error("Ошибка при получении данных Задач:", error);
    return new Response(
      JSON.stringify({ message: "Ошибка при получении данных Задач" }),
      { status: 500 }
    );
  }
}