import { connectDB } from "@/src/lib/db";
import Partner from "@/src/models/Partner";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    // Чтение данных из тела запроса
    const { field, value } = await request.json();

    // Очистка значения поля от пробелов и других символов
    const cleanedValue = value.replace(/\s+/g, '').replace(/[^\d\+]/g, '').trim(); // Убираем пробелы и все нецифровые символы
    console.log('Очищенное значение для поиска:', cleanedValue); // Логируем очищенное значение

    // Проверка на пустое значение
    if (!cleanedValue || cleanedValue.trim() === "") {
      const fieldNames: { [key: string]: string } = {
        phone: "телефон",
        numberDE: "номер DE",
        email: "почта",
      };
      
      const fieldName = fieldNames[field as keyof typeof fieldNames];
      console.log(`Поле "${fieldName}" пустое или некорректное.`); // Логируем ошибку на пустое значение

      return new NextResponse(
        JSON.stringify({
          error: true,
          message: `Пожалуйста, укажите ${fieldName}.`,
        }),
        { status: 400 }
      );
    }

    await connectDB();

    // Логируем значение поля
    console.log("Получено поле для проверки уникальности:", field);

    let existingPartner;
    if (field === "phone") {
      console.log('Ищем партнёра по телефону...');
      // Приводим номер в базе данных к единому виду, убираем пробелы и символы
      existingPartner = await Partner.findOne({ phone: { $regex: new RegExp(`^${cleanedValue}$`, 'i') } });
    } else if (field === "numberDE") {
      console.log('Ищем партнёра по номеру DE...');
      existingPartner = await Partner.findOne({ numberDE: cleanedValue });
    } else if (field === "email") {
      console.log('Ищем партнёра по email...');
      existingPartner = await Partner.findOne({ email: cleanedValue });
    }

    if (existingPartner) {
      // Логируем, что партнёр найден
      console.log('Партнёр найден:', existingPartner);
      
      const fieldNames: { [key: string]: string } = {
        phone: "телефон",
        numberDE: "номер DE",
        email: "почта",
      };
      const fieldName = fieldNames[field as keyof typeof fieldNames];

      return new NextResponse(
        JSON.stringify({
          error: true,
          message: `Партнёр с таким ${fieldName} уже существует: ${existingPartner.name}, ${fieldName}: ${existingPartner[field]}`,
          metadata: { partnerId: existingPartner._id.toString() },
        }),
        { status: 400 }
      );
    }

    // Логируем успешный ответ, если партнёр не найден
    console.log('Партнёр с таким значением не найден.');
    return new NextResponse(
      JSON.stringify({ success: true }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка при проверке уникальности:', error); // Логируем ошибку
    return new NextResponse(
      JSON.stringify({ message: "Ошибка при проверке уникальности", error }),
      { status: 500 }
    );
  }
};

