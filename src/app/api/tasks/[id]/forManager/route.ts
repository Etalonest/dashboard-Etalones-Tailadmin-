import Task from "@/src/models/Task";

export const GET = async (request: Request, { params }: { params: { id: string } }) => {
  const { id } = params;

  try {
    const tasks = await Task.find({ 
      assignedTo: id,
      status: { $ne: "выполнена" } // Исключаем задачи со статусом "выполнена"
    })
    .sort({ createdAt: -1 }) // Сортировка по дате создания (от самых новых)
    .populate(["assignedTo", "candidate", "stage", "appointed"]);

    if (tasks.length === 0) {
      console.log("Нет задач для менеджера с ID:", id);
      return new Response(
        JSON.stringify({ message: "Нет задач" }),
        { status: 200 }
      );
    }

    return new Response(JSON.stringify(tasks), { status: 200 });
  } catch (error) {
    console.error("Ошибка при получении задач:", error);
    return new Response(
      JSON.stringify({ error: "Ошибка при получении данных" }),
      { status: 500 }
    );
  }
};

