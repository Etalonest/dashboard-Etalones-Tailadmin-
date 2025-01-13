import { NextResponse } from 'next/server';
import Candidate from "@/src/models/Candidate";  // Модель кандидата
import { log } from 'console';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const phone = body.phone;
    console.log("PHONE", phone);

    if (!phone || typeof phone !== 'string' || phone.trim() === "") {
      return NextResponse.json(
        { error: "Phone parameter is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    // Ищем кандидата по номеру телефона (с точным совпадением)
    const candidate = await Candidate.findOne({
      phone: phone.trim(),  // Ищем строго по введенному номеру телефона
    });

    // Если кандидат найден, проверяем совпадение номеров по длине
    if (candidate) {
      if (candidate.phone.trim() === phone.trim()) {
        // Если номера точно совпадают, возвращаем данные кандидата
        return NextResponse.json({
          candidate: {
            name: candidate.name,
            phone: candidate.phone  // Отправляем имя кандидата
          },
        });
      } else {
        // Если номера не совпадают по длине или содержимому, возвращаем "Номер свободен"
        return NextResponse.json({
          message: "Номер свободен",
        });
      }
    } else {
      // Если кандидат не найден
      return NextResponse.json({
        message: "Номер свободен",
      });
    }
  } catch (error) {
    console.error("Error searching:", error);
    return NextResponse.json({ error: "Error searching data" }, { status: 500 });
  }
}

// import { NextResponse } from 'next/server';
// import Candidate from "@/src/models/Candidate";  // Модель кандидата

// export async function POST(req: Request) {
//   try {
//     // Парсим тело запроса для получения номера телефона
//     const body = await req.json();
//     const phone = body.phone;

//     if (!phone || typeof phone !== 'string' || phone.trim() === "") {
//       return NextResponse.json(
//         { error: "Phone parameter is required and must be a non-empty string" },
//         { status: 400 }
//       );
//     }

//     // Поиск кандидата по номеру телефона с регистронезависимым поиском
//     const candidate = await Candidate.findOne({
//       phone: { $regex: phone, $options: "i" },  // Регулярное выражение для поиска
//     });

//     // Ответ с результатами: если кандидат найден, возвращаем его имя
//     if (candidate) {
//       return NextResponse.json({
//         candidate: {
//           name: candidate.name,
//           phone: candidate.phone  // Отправляем имя кандидата
//         },
//       });
//     } else {
//       // Если кандидат не найден
//       return NextResponse.json({
//         message: "Номер свободен",
//       });
//     }
//   } catch (error) {
//     console.error("Error searching:", error);
//     return NextResponse.json({ error: "Error searching data" }, { status: 500 });
//   }
// }
