import { connectDB } from "@/src/lib/db";
import Vacancies from "@/src/models/Vacancies";

// Типизация вакансий
interface Vacancy {
  _id: string;
  title: string;
  partner: {
    companyName: string;
  };
  manager: {
    name: string;
    phone: string;
  };
}

export const GET = async (request: Request): Promise<Response> => {
  await connectDB();
  
  // Получаем все вакансии с сортировкой по title
  const vacancies: Vacancy[] = await Vacancies.find({})
    .sort({ title: 1 })
    .populate({
      path: "partner",
      select: "companyName", // Только поле companyName из partner
    })
    .populate({
      path: "manager",
      select: "name phone", // Только поля name и phone из manager
    });

  return new Response(JSON.stringify(vacancies), { status: 200 });
};
