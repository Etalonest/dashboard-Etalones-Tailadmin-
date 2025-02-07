import { connectDB } from "@/src/lib/db";
import Task from "@/src/models/Task";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
    await connectDB();
    const tasks = await Task.find({}).populate(["assignedTo", "candidate","stage",]);
    return new NextResponse(JSON.stringify(tasks), { status: 200 });
  }
  catch (error) {
    console.error("Ошибка при получении данных Задач:", error);
    return new NextResponse(
      JSON.stringify({ message: "Ошибка при получении данных Задач" }),
      { status: 500 }
    );
  }
}