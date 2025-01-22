import { connectDB } from "@/src/lib/db";
import Partner from "@/src/models/Partner";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    // Чтение данных из тела запроса
    const { field, value } = await request.json(); 

    await connectDB();

    // Объект с текстовыми значениями для каждого поля
    const fieldNames: { [key: string]: string } = {
      phone: "телефон",
      numberDE: "номер DE",
      email: "почта",
    };

    // Логируем значение field
    console.log("Получено поле для проверки уникальности:", field);
    
    let existingPartner;
    // Используем fieldNames для получения правильного текста
    if (field === "phone") {
      existingPartner = await Partner.findOne({ phone: value });
    } else if (field === "numberDE") {
      existingPartner = await Partner.findOne({ numberDE: value });
    } else if (field === "email") {
      existingPartner = await Partner.findOne({ email: value });
    }

    if (existingPartner) {
      // Получаем текстовое значение поля
      const fieldName = fieldNames[field as keyof typeof fieldNames];

      // Убедимся, что fieldName корректно вытаскивается
      console.log("Поле для отображения в сообщении:", fieldName);

      // Теперь строим сообщение с правильным значением поля
      return new NextResponse(
        JSON.stringify({
          error: true,
          message: `Партнёр с таким ${fieldName} уже существует: ${existingPartner.name}, ${fieldName}: ${existingPartner[field]}`,
          metadata: { partnerId: existingPartner._id.toString() },
        }),
        { status: 400 }
      );
    }

    return new NextResponse(
      JSON.stringify({ success: true }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Ошибка при проверке уникальности", error }),
      { status: 500 }
    );
  }
};

