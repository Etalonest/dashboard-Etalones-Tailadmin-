import { connectDB } from "@/src/lib/db";
import EventLog from "@/src/models/EventLog";
import Manager from "@/src/models/Manager";
import Partner from "@/src/models/Partner";
import { p } from "framer-motion/client";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
    try {
      const formData = await request.formData();
      console.log("formData", formData);
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
console.log("professions", professions);
      const contractRaw = formData.get("contract");
      const contract = contractRaw ? JSON.parse(contractRaw as string) : {};
      await connectDB();

      const existingPartner = await Partner.findOne({ phone });
    if (existingPartner) {
      return new NextResponse(
        JSON.stringify({
          error: true,
          message: `Партнёр с таким номером уже существует ${existingPartner.name}`,
          metadata: {
            partnerId: existingPartner._id.toString(), 
          },
        }),
        { status: 400 }
      );
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
    contract,
    manager: manager
  }
  
      const newPartner = new Partner(body);
    
      await newPartner.save();
  
      if (newPartner.manager) {
        const manager = await Manager.findById(newPartner.manager);
        
        if (!manager) {
          return new NextResponse(
            JSON.stringify({ message: "Менеджер не найден" }),
            { status: 404 }
          );
        }
  
        await Manager.findByIdAndUpdate(
          body.manager,
          { $addToSet: { partners: newPartner._id } }, 
          { new: true }
        );
      }
  
      const eventLog = new EventLog({
        eventType: 'Создан партнёр',
        relatedId: newPartner._id,
        manager: manager,
        description: `Добавлен новый партнёр: ${newPartner.name}`,
      });
      console.log("EVENTLOG", eventLog)
      await eventLog.save();
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
  