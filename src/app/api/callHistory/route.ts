
import { connectDB } from "@/src/lib/db";
import Dialog from "@/src/models/Dialog";
import Candidate from "@/src/models/Candidate";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  await connectDB();

  try {
    const { candidateId, author, status, comment } = await request.json();

    // Создаем новый документ для диалога (звонка)
    const newDialog = new Dialog({
      text: status === 'Дозвонился' ? 'Дозвонился' : 'Не дозвонился',
      author: author,
      date: new Date(),
      candidate: candidateId,
      comment: status === 'Дозвонился' ? comment : '', // Если статус 'Дозвонился', то добавляем комментарий
    });

    // Сохраняем новый диалог в базе данных
    const savedDialog = await newDialog.save();
    console.log("newDialog saved:", savedDialog); // Логирование сохраненного диалога

    // Обновляем массив dialogs кандидата, добавляем новый диалог
    const updateData: any = {
      $push: { dialogs: savedDialog._id }, // Добавляем новый диалог в массив
    };

    // Если статус 'Дозвонился' и есть комментарий, добавляем комментарий в массив comments кандидата
    if (status === 'Дозвонился' && comment) {
      updateData.$push = {
        ...updateData.$push,
        comment: { author, text: comment, date: new Date() }, // Добавляем комментарий в массив comments
      };
      console.log("Комментарий будет добавлен в массив comment кандидата:", {
        author,
        text: comment,
        date: new Date(),
      });
    }

    // Обновляем кандидата с новым диалогом и, при необходимости, с комментарием
    const updatedCandidate = await Candidate.updateOne(
      { _id: candidateId },
      updateData
    );

    if (updatedCandidate.modifiedCount === 0) {
      console.log("Кандидат не найден или массив не обновился");
      return NextResponse.json({ message: "Кандидат не найден или массив не обновился" }, { status: 404 });
    }

    console.log("Кандидат обновлен, новый диалог добавлен в массив dialogs");

    // Логируем финальное состояние кандидата
    const candidateAfterUpdate = await Candidate.findById(candidateId);
    console.log("Кандидат после обновления:", candidateAfterUpdate);

    return NextResponse.json({ message: "Звонок успешно записан" }, { status: 200 });
  } catch (error) {
    console.error("Ошибка при записи звонка:", error);
    return NextResponse.json({ message: "Ошибка при записи звонка" }, { status: 500 });
  }
};
