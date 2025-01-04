// app/api/admin/stats/route.js
import Manager from "@/src/models/Manager";
import Candidate from "@/src/models/Candidate";
import User from "@/src/models/User";
import Partner from "@/src/models/Partner";

export async function GET() {
  try {
    // Подсчитываем количество пользователей и партнеров
    const totalUsers = await User.countDocuments();
    const totalCandidates = await Candidate.countDocuments();
    const totalPartners = await Partner.countDocuments(); // Логика для подсчета заказчиков

    // Получаем список менеджеров с нужными полями
    const managers = await Manager.find().select("name email");

    // Формируем объект статистики
    const stats = {
      totalUsers,
      totalPartners,
      totalCandidates,
      managers: managers.map((manager) => ({
        id: manager._id.toString(), // Преобразуем ObjectId в строку
        name: manager.name,
        email: manager.email,
      })),
    };

    // Возвращаем ответ в формате JSON
    return new Response(JSON.stringify(stats), { status: 200 });
  } catch (error) {
    console.error('Ошибка при получении статистики:', error);
    return new Response(JSON.stringify({ error: "Ошибка при получении статистики" }), { status: 500 });
  }
}
