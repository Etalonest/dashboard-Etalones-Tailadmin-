import { connectDB } from "@/src/lib/db";
import EventLog from "@/src/models/EventLog";
import Manager from "@/src/models/Manager";
import Partner from "@/src/models/Partner";
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
      const statusWorkRaw = formData.get('statusWork');
      const statusWork = statusWorkRaw ? JSON.parse(statusWorkRaw as string) : [];
      const site = formData.get("site");    
      const manager = formData.get("managerId");

      const documentsRaw = formData.get('documents');
      const documents = documentsRaw ? JSON.parse(documentsRaw as string) : [];

      const professionsRaw = formData.get("professions");
      const professions = professionsRaw ? JSON.parse(professionsRaw as string) : [];
      const commentRaw = formData.get('comment');
      const comment = commentRaw ? (Array.isArray(commentRaw) ? commentRaw : [commentRaw]).map(item => {
      try {
        const parsedItem = JSON.parse(item);
        if (parsedItem.author && parsedItem.text && parsedItem.date) {
          return parsedItem;
        } else {
          return {
            author: manager, 
            text: item,
            date: new Date().toISOString(),
          };
        }
      } catch (e) {
        return {
          author: manager, 
          text: item,
          date: new Date().toISOString(),
        };
      }
    }) : [];
      const contractRaw = formData.get("contract");
      const contract = contractRaw ? JSON.parse(contractRaw as string) : {};
      await connectDB();

      const existingPartnerByPhone = await Partner.findOne({ phone });
    if (existingPartnerByPhone) {
      return new NextResponse(
        JSON.stringify({
          error: true,
          message: `Партнёр с таким номером уже существует ${existingPartnerByPhone.name}`,
          metadata: {
            partnerId: existingPartnerByPhone._id.toString(),
          },
        }),
        { status: 400 }
      );
    }

    // Проверяем наличие партнёра с таким же email
    const existingPartnerByEmail = await Partner.findOne({ email });
    if (existingPartnerByEmail) {
      return new NextResponse(
        JSON.stringify({
          error: true,
          message: `Партнёр с таким email уже существует: ${existingPartnerByEmail.name}`,
          metadata: {
            partnerId: existingPartnerByEmail._id.toString(),
          },
        }),
        { status: 400 }
      );
    }

    // Проверяем наличие партнёра с таким же названием компании
    const existingPartnerByCompanyName = await Partner.findOne({ companyName });
    if (existingPartnerByCompanyName) {
      return new NextResponse(
        JSON.stringify({
          error: true,
          message: `Партнёр с таким названием компании уже существует: ${existingPartnerByCompanyName.name}`,
          metadata: {
            partnerId: existingPartnerByCompanyName._id.toString(),
          },
        }),
        { status: 400 }
      );
    }

    // Проверяем наличие партнёра с таким же номером DE
    const existingPartnerByNumberDE = await Partner.findOne({ numberDE });
    if (existingPartnerByNumberDE) {
      return new NextResponse(
        JSON.stringify({
          error: true,
          message: `Партнёр с таким номером DE уже существует: ${existingPartnerByNumberDE.name}`,
          metadata: {
            partnerId: existingPartnerByNumberDE._id.toString(),
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
    documents,
    statusWork,
    location,
    comment,
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
      await eventLog.save();
      return new NextResponse(
        JSON.stringify({ message: "Новый партнёр создан успешно", partner: newPartner, metadata: newPartner._id.toString(), success: true }),
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
  