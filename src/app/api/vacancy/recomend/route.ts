import { connectDB } from "@/src/lib/db"; // Make sure to import the correct DB connection
import  Vacancies from "@/src/models/Vacancies"; // Import your Vacancy model
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    // Connect to the database
    console.log("Подключение к базе данных...");
    await connectDB();
    console.log("Подключение к базе данных выполнено.");

    // Extract the query parameters
    const url = new URL(req.url);
    const professionNames = url.searchParams.get("professionNames");
    console.log("Запрашиваемые профессии:", professionNames);

    // If no profession names are provided, return all vacancies
    if (!professionNames) {
      console.log("Профессии не указаны, возвращаем все вакансии...");
      const vacancies = await Vacancies.find().sort({ createdAt: -1 })
        .populate({
          path: 'manager',
          select: 'name',
        })
        .populate({
          path: 'interviews',
          select: 'name',
        })
        .populate({
          path: 'candidates',
          select: 'name',
        });

      console.log("Найдено вакансий:", vacancies.length);
      return new NextResponse(JSON.stringify(vacancies), { status: 200 });
    }

    // Split the profession names into an array
    const professionsArray = professionNames.split(",");
    console.log("Разделенные профессии:", professionsArray);

    // Query the vacancies based on the provided profession names, now searching in 'title' field
    console.log("Поиск вакансий по профессиям...");
    const filteredVacancies = await Vacancies.find({
      title: { $in: professionsArray } // ищем по полю 'title', а не 'profession'
    })
      .sort({ createdAt: -1 })
      .populate({
        path: 'manager',
        select: 'name',
      })
      .populate({
        path: 'interviews',
        select: 'name',
      })
      .populate({
        path: 'candidates',
        select: 'name',
      });

    console.log("Найдено вакансий для указанных профессий:", filteredVacancies.length);
    
    // Return the filtered vacancies
    return new NextResponse(JSON.stringify(filteredVacancies), { status: 200 });

  } catch (error: any) {
    // Return an error message in case of failure
    console.error("Ошибка при получении вакансий:", error);
    return new NextResponse(`Ошибка при получении вакансий: ${error.message}`, {
      status: 500,
    });
  }
};
