// import { connectDB } from "@/src/lib/db";
// import Dialog from "@/src/models/Dialog";
// import Candidate from "@/src/models/Candidate"; // Модель для кандидатов
// import { NextResponse } from "next/server";

// export const POST = async (request: Request) => {
//   await connectDB();

//   try {
//     const { candidateId, author, status } = await request.json();
//     console.log("userId", author);

//     // Создаем новый документ для диалога (звонка)
//     const newDialog = new Dialog({
//       text: status === 'Дозвонился' ? 'Дозвонился' : 'Не дозвонился',
//       author: author,
//       date: new Date(),
//       candidate: candidateId,
//     });

//     // Сохраняем новый диалог в базе данных
//     await newDialog.save();

//     // Обновляем массив диалогов кандидата, добавляем новый диалог.
//     // Если массива нет, инициализируем его.
//     const updatedCandidate = await Candidate.findByIdAndUpdate(
//       candidateId,
//       {
//         $setOnInsert: { dialogs: [] }, // Инициализируем массив при первом добавлении
//         $push: { dialogs: newDialog._id }, // Добавляем новый диалог в массив
//       },
//       { new: true, upsert: true } // Возвращаем обновленный документ и создаем нового кандидата, если его нет
//     );

//     if (!updatedCandidate) {
//       return NextResponse.json({ message: "Кандидат не найден" }, { status: 404 });
//     }

//     return NextResponse.json({ message: "Звонок успешно записан" }, { status: 200 });
//   } catch (error) {
//     console.error("Ошибка при записи звонка:", error);
//     return NextResponse.json({ message: "Ошибка при записи звонка" }, { status: 500 });
//   }
// };
import { connectDB } from "@/src/lib/db";
import Dialog from "@/src/models/Dialog";
import Candidate from "@/src/models/Candidate";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  await connectDB();

  try {
    const { candidateId, author, status } = await request.json();
    console.log("userId", author); // Логирование id пользователя
    console.log("candidateId", candidateId); // Логирование id кандидата

    // Создаем новый документ для диалога (звонка)
    const newDialog = new Dialog({
      text: status === 'Дозвонился' ? 'Дозвонился' : 'Не дозвонился',
      author: author,
      date: new Date(),
      candidate: candidateId,
    });

    // Сохраняем новый диалог в базе данных
    const savedDialog = await newDialog.save();
    console.log("newDialog saved:", savedDialog); // Логирование сохраненного диалога

    // Обновляем массив dialogs кандидата, добавляем новый диалог
    const updatedCandidate = await Candidate.findOneAndUpdate(
      { _id: candidateId },
      {
        $push: { dialogs: savedDialog._id } // Добавляем новый диалог в массив
      },
      { new: true } // Возвращаем обновленный документ
    );

    if (!updatedCandidate) {
      console.log("Кандидат не найден");
      return NextResponse.json({ message: "Кандидат не найден" }, { status: 404 });
    }

    console.log("Кандидат обновлен, новый диалог добавлен в массив dialogs:", updatedCandidate.dialogs);

    return NextResponse.json({ message: "Звонок успешно записан" }, { status: 200 });
  } catch (error) {
    console.error("Ошибка при записи звонка:", error);
    return NextResponse.json({ message: "Ошибка при записи звонка" }, { status: 500 });
  }
};
