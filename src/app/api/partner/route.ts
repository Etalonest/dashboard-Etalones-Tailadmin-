import { connectDB } from "@/src/lib/db";
import Manager from "@/src/models/Manager";
import Partner from "@/src/models/Partner";
import { error } from "console";
import { b } from "framer-motion/client";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
    try {
      const formData = await request.formData();
// недоделанный путь
      const name = formData.get("name");
      const phone = formData.get("phone");
      const viber = formData.get("viber");
      const telegram = formData.get("telegram");
      const whatsapp = formData.get("whatsapp");
      const email = formData.get("email");
      const companyName = formData.get("companyName");
      const numberDE = formData.get("numberDE");
      const location = formData.get("location");
      const site = formData.get("site");    
      const manager = formData.get("managerId");

      const professionsRaw = formData.get("professions");
      const professions = professionsRaw ? JSON.parse(professionsRaw as string) : [];
      console.log("professions111", professions);
      
      
      await connectDB();

      const existingPartner = await Partner.findOne({ phone });
if (existingPartner){
  console.log('Партнёр с таким номером уже существует', existingPartner);
  return new NextResponse(
    JSON.stringify({
      error: true,
      message: 'Партнёр с таким номером уже существует',
    }),
    { status: 400 }
  )
}

  const body = {
    name,
    phone,
    viber,
    telegram,
    whatsapp,
    email,
    companyName,
    numberDE,
    location,
    site,
    professions,
    manager: manager
  }
  
      const newPartner = new Partner(
        body
      );
      await newPartner.save();
  
      // Логика для менеджера:
      if (newPartner.manager) {
        // Проверяем, существует ли менеджер
        const manager = await Manager.findById(newPartner.manager);
        
        if (!manager) {
          return new NextResponse(
            JSON.stringify({ message: "Manager not found" }),
            { status: 404 }
          );
        }
  
        // Добавляем партнёра в массив partners нового менеджера
        await Manager.findByIdAndUpdate(
          body.manager,
          { $addToSet: { partners: newPartner._id } }, // Добавляем уникально
          { new: true }
        );
      }
  
      // Возвращаем успешный ответ с данными о новом партнёре
      return new NextResponse(
        JSON.stringify({ message: "Новый партнёр создан успешно", partner: newPartner }),
        { status: 201 }
      );
  
    } catch (error) {
      return new NextResponse(
        JSON.stringify({
          message: "Ошибка при создании партёра",
          error,
        }),
        { status: 500 }
      );
    }
  };
  