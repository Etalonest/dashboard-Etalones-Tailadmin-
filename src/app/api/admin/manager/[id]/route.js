// app/api/admin/manager/[id]/route.js
import Manager from "@/src/models/Manager";
import Candidate from "@/src/models/Candidate";  // Подключаем модель Candidate
import Partner from "@/src/models/Partner";    // Подключаем модель Partner

export async function GET({ params }) {
  const { id } = params;  // Параметры извлекаются через params, используем 'id', а не 'managerId'
  console.log("Запрос на статистику для менеджера с ID:", id);  // Лог для отслеживания ID менеджера

  try {
    // Лог перед запросом к базе данных для поиска менеджера
    console.log("Ищем менеджера в базе данных...");
    const manager = await Manager.findById(id).populate("role");

    if (!manager) {
      console.log("Менеджер с ID", id, "не найден.");
      return new Response(
        JSON.stringify({ error: "Менеджер не найден" }),
        { status: 404 }
      );
    }

    console.log("Менеджер найден:", manager);  // Лог данных менеджера

    // Лог перед подсчетом кандидатов
    console.log("Подсчитываем количество кандидатов для менеджера...");
    const totalCandidates = await Candidate.countDocuments({ manager: id });
    console.log("Количество кандидатов:", totalCandidates);  // Лог количества кандидатов

    // Лог перед подсчетом партнеров
    console.log("Подсчитываем количество партнеров для менеджера...");
    const totalPartners = await Partner.countDocuments({ manager: id });
    console.log("Количество партнеров:", totalPartners);  // Лог количества партнеров

    // Формируем статистику менеджера
    const managerStats = {
      name: manager.name,
      totalCandidates,
      totalPartners,
    };

    console.log("Статистика менеджера сформирована:", managerStats);  // Лог статистики

    // Возвращаем ответ с данными
    return new Response(JSON.stringify(managerStats), { status: 200 });
  } catch (error) {
    // Логируем ошибку
    console.error("Ошибка при получении статистики менеджера:", error);
    return new Response(
      JSON.stringify({ error: "Ошибка при получении статистики менеджера" }),
      { status: 500 }
    );
  }
}
