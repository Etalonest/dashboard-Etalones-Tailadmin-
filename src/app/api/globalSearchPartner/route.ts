import { connectDB } from "@/src/lib/db";
import Partner from "@/src/models/Partner";  // Подключаем модель партнёра
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    const phone = searchParams.get("phone");
    const profession = searchParams.get("profession");
    const status = searchParams.get("status");
    const document = searchParams.get("document");
    const manager = searchParams.get("manager");
    const location = searchParams.get("location");

    const filter: any = {};

    // Фильтрация по имени
    if (name) filter.name = { $regex: name, $options: "i" };

    // Фильтрация по телефону
    if (phone) {
      const phoneRegex = new RegExp(phone, "i");
      filter.$or = [
        { phone: { $regex: phoneRegex } },
        { additionalPhones: { $regex: phoneRegex } },
      ];
    }

    // Фильтрация по профессии
    if (profession)
      filter.professions = { $elemMatch: { name: { $regex: profession, $options: "i" } } };

    // Фильтрация по статусу
    if (status) {
      filter.$or = [
        { status: { $regex: status, $options: "i" } },
        { statusWork: { $elemMatch: { name: { $regex: status, $options: "i" } } } },
      ];
    }

    // Фильтрация по документам
    if (document)
      filter.documents = { $elemMatch: { docType: { $regex: document, $options: "i" } } };

    // Фильтрация по менеджеру
    if (manager) filter.manager = manager;

    // Фильтрация по локации
    if (location) filter.locations = { $regex: location, $options: "i" };

    // Выполнение запроса
    const partners = await Partner.find(filter).sort({ createdAt: -1 })
      .populate({ path: 'manager', select: 'name' });

    return new NextResponse(JSON.stringify({ partners }), { status: 200 });
  } catch (error) {
    console.error("Error in fetching:", error);
    return new NextResponse("Error in fetching: " + error, { status: 500 });
  }
};
