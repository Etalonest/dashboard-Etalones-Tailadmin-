import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";  
import Vacancies from "@/src/models/Vacancies";  
import Partner from "@/src/models/Partner";
import Manager from "@/src/models/Manager";
import EventLog from "@/src/models/EventLog";
import Stage from "@/src/models/Stage";


const STAGE_NEW = process.env.NEXT_PUBLIC_VACANCYS_STAGE_NEW;
const STAGE_ALL = process.env.NEXT_PUBLIC_VACANCYS_STAGE_ALL;
export const GET = async (req: Request) => {
  try {
    await connectDB();

    const vacancy = await Vacancies.find().sort({ createdAt: -1 })
    .populate(['manager', 'partner','interviews'])
   


    return new NextResponse(JSON.stringify(vacancy), { status: 200 });
  } catch (error: any) {
    return new NextResponse(`Ошибка при получении вакансий: ${error.message}`, {
      status: 500,
    });
  }
};

export const POST = async (request: Request) => {
  try {
    const formData = await request.formData();
    console.log("formData", formData);
    
    const title = formData.get("title");
    const place = formData.get("place");
    const skills = formData.get("skills");
    const roof_type = formData.get("roof_type");
    const location = formData.get("location");
    const salary = formData.get("salary");
    const homePrice = formData.get("homePrice");
    const home_descr = formData.get("home_descr");
    const work_descr = formData.get("work_descr");
    const grafik = formData.get("grafik");
    const managerId = formData.get("managerId");
    const partnerId = formData.get("partnerId"); 
    const imageFB = formData.get("imageUrl");
    const homeImageFB = formData.get("homeImageUrl");
    const homeImageUrls = homeImageFB ? JSON.parse(homeImageFB as string) : [];
    const homeImages = Array.isArray(homeImageUrls) ? homeImageUrls : [homeImageUrls];
    const workImageFB = formData.get("workImageUrl");
    const workImageUrls = workImageFB ? JSON.parse(workImageFB as string) : [];
    const workImages = Array.isArray(workImageUrls) ? workImageUrls : [workImageUrls];
    const languesRaw = formData.get('langue');
    const langues = languesRaw ? JSON.parse(languesRaw as string) : [];
    const documentsRaw = formData.get('documents');
    const documents = documentsRaw ? JSON.parse(documentsRaw as string) : [];
    const drivePermisRaw = formData.get('drivePermis');
    const drivePermis = drivePermisRaw ? JSON.parse(drivePermisRaw as string) : [];     


    await connectDB();

    const body = {
      imageFB,
      title,
      place,
      skills,
      roof_type,
      location,
      salary,
      homePrice,
      home_descr,
      work_descr,
      grafik,
      drivePermis,
      langues,
      documents,
      homeImageFB: homeImages,
      workImageFB: workImages,
      manager: managerId,
      partner: partnerId, 
    };

    const newVacancy = new Vacancies(body);
    await newVacancy.save();
    console.log("newVacancy", newVacancy);

    if (partnerId) {
      const partner = await Partner.findById(partnerId);

      if (!partner) {
        return new NextResponse(
          JSON.stringify({ message: "Партнёр не найден" }),
          { status: 404 }
        );
      }

      const professionIndex = partner.professions.findIndex((profession:any) => profession.name === title);

      if (professionIndex === -1) {
        return new NextResponse(
          JSON.stringify({ message: "Профессия не найдена" }),
          { status: 404 }
        );
      }

      partner.professions[professionIndex].vacancy = newVacancy._id;

      // Сохраняем обновленного партнера
      await partner.save();
      const updatedPartner = await Partner.findById(partner._id);
      console.log("Updated Partner:", updatedPartner);
    }

    // Обновляем менеджера
    if (managerId) {
        const manager = await Manager.findById(managerId);
  
        if (!manager) {
          return new NextResponse(
            JSON.stringify({ message: "Менеджер не найден" }),
            { status: 404 }
          );
        }
  
        const updatedManager = await Manager.findByIdAndUpdate(
          managerId,
          { $addToSet: { vacancy: newVacancy._id } },
          { new: true }
        );
  
        console.log("Updated Manager:", updatedManager);
      }
      const stageNewId = STAGE_NEW;
      const stageAllId = STAGE_ALL;
      if (stageNewId) {
        await Stage.findByIdAndUpdate(
          stageNewId,
          { $push: { vacancy: newVacancy._id } },
          { new: true }
        );
      }
      if (stageAllId) {
        await Stage.findByIdAndUpdate(
          stageAllId,
          { $push: { vacancy: newVacancy._id } },
          { new: true }
        );
      }
      const eventLog = new EventLog({
        eventType: 'Создана вакансия',
        relatedId: newVacancy._id,
        manager: managerId,
        description: `Добавлена новая вакансия: ${newVacancy.title}`,
      });
      console.log("EVENTLOG", eventLog)
      await eventLog.save();

     
    return new NextResponse(
      JSON.stringify({ 
        message: "Новая вакансия создана успешно",
        success: true, 
        partner: newVacancy }),
      { status: 201 }
    );

  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        message: "Ошибка при создании вакансии",
        error,
      }),
      { status: 500 }
    );
  }
};
