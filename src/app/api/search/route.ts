// src/app/api/search/route.ts

import { NextResponse } from 'next/server';
import Manager from "@/src/models/Manager";  // Модель менеджера
import Partner from "@/src/models/Partner";  // Модель партнёра
import Candidate from "@/src/models/Candidate";  // Модель кандидата

export async function GET(req: Request) {
  // Получаем параметр "query" из строки запроса
  const url = new URL(req.url);  // Получаем URL запроса
  const query = url.searchParams.get('query');  // Извлекаем параметр query

  if (!query || typeof query !== 'string' || query.trim() === "") {
    return NextResponse.json(
      { error: "Query parameter 'query' is required and must be a non-empty string" },
      { status: 400 }
    );
  }

  try {
    // Поиск кандидатов по номеру телефона с регистронезависимым поиском
    const candidates = await Candidate.find({
      phone: { $regex: query, $options: "i" },
    });

    // Поиск партнёров
    const partners = await Partner.find({
      phone: { $regex: query, $options: "i" },
    });

    // Поиск менеджеров (если нужно добавить)
    const managers = await Manager.find({
      phone: { $regex: query, $options: "i" },
    });

    // Ответ с найденными результатами
    return NextResponse.json({
      candidates,
      partners,
      managers,
    });
  } catch (error) {
    console.error("Error searching:", error);
    return NextResponse.json({ error: "Error searching data" }, { status: 500 });
  }
}
// import { NextResponse } from 'next/server';
// import Manager from "@/src/models/Manager";  // Модель менеджера
// import Partner from "@/src/models/Partner";  // Модель партнёра
// import Candidate from "@/src/models/Candidate";  // Модель кандидата

// // Функция для генерации всех возможных вариаций номера с пробелами
// function generatePhoneVariations(phone: string): string[] {
//   const variations = [];
//   const length = phone.length;

//   // Генерируем все возможные места для пробелов в строке
//   for (let i = 1; i < length; i++) {
//     const prefix = phone.slice(0, i);
//     const suffix = phone.slice(i);
//     variations.push(prefix + " " + suffix);  // Добавляем пробел в каждой возможной позиции
//   }

//   return variations;
// }

// export async function GET(req: Request) {
//   // Получаем параметр "query" из строки запроса
//   const url = new URL(req.url);  // Получаем URL запроса
//   const query = url.searchParams.get('query');  // Извлекаем параметр query

//   if (!query || typeof query !== 'string' || query.trim() === "") {
//     return NextResponse.json(
//       { error: "Query parameter 'query' is required and must be a non-empty string" },
//       { status: 400 }
//     );
//   }

//   // Генерируем все возможные вариации запроса с пробелами
//   const cleanQuery = query.replace(/\s+/g, ''); // Убираем пробелы из строки запроса
//   const variations = generatePhoneVariations(cleanQuery);

//   try {
//     // Создаем регулярное выражение для поиска всех вариаций с пробелами
//     const regexString = variations.join("|");  // Соединяем все вариации с пробелами через "или"
//     const regex = new RegExp(regexString, 'i'); // Регулярное выражение с флагом 'i' для игнорирования регистра

//     // Поиск кандидатов по номерам с пробелами
//     const candidates = await Candidate.find({
//       phone: { $regex: regex },
//     });

//     // Поиск партнёров
//     const partners = await Partner.find({
//       phone: { $regex: regex },
//     });

//     // Поиск менеджеров
//     const managers = await Manager.find({
//       phone: { $regex: regex },
//     });

//     // Ответ с найденными результатами
//     return NextResponse.json({
//       candidates,
//       partners,
//       managers,
//     });
//   } catch (error) {
//     console.error("Error searching:", error);
//     return NextResponse.json({ error: "Error searching data" }, { status: 500 });
//   }
// }
