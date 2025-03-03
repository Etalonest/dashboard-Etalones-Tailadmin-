import Task from "@/src/models/Task";

export const GET = async (request: Request, { params }: { params: { id: string } }) => {
  const { id } = params;

  try {
    const tasks = await Task.findById({ id });

    if (tasks.length === 0) {
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

export const PATCH = async (request: Request, { params }: { params: { id: string } }) => {
  const { id } = params; // Получаем taskId из URL
  const { status } = await request.json(); // Получаем новый статус из тела запроса

  try {
    const task = await Task.findById(id);

    if (!task) {
      return new Response(
        JSON.stringify({ message: "Задача не найдена" }),
        { status: 404 }
      );
    }

    // Обновляем статус задачи
    task.status = status;
    await task.save(); // Сохраняем изменения

    return new Response(
      JSON.stringify({ message: "Статус задачи обновлен успешно" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Ошибка при обновлении задачи:", error);
    return new Response(
      JSON.stringify({ error: "Ошибка при обновлении задачи" }),
      { status: 500 }
    );
  }
};