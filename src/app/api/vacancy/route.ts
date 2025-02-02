import { connectDB } from "@/src/lib/db";
import Manager from "@/src/models/Manager";
import VacancyOnServer from "@/src/models/VacancyOnServer";
import Profession from "@/src/models/Profession";
import { NextResponse } from "next/server";

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
      const manager = formData.get("managerId");

      const professionsRaw = formData.get("professions");
      const professions = professionsRaw ? JSON.parse(professionsRaw as string) : [];
console.log("professions", professions);
      const contractRaw = formData.get("contract");
      const contract = contractRaw ? JSON.parse(contractRaw as string) : {};
      await connectDB();

  const body = {
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
    
    professions,
    contract,
    manager: manager
  }
  
      const newVacancyOnServer = new VacancyOnServer(body);
    
      await newVacancyOnServer.save();
  
      if (newVacancyOnServer.professions) {
        const professions = await Profession.findById(newVacancyOnServer.professions);
        
        if (!professions) {
          return new NextResponse(
            JSON.stringify({ message: "Профессии не найдены" }),
            { status: 404 }
          );
        }
  
        await Profession.findByIdAndUpdate(
          body.professions,
          { $addToSet: { vacancy: newVacancyOnServer._id } }, 
          { new: true }
        );
      }

      if (newVacancyOnServer.manager) {
        const manager = await Manager.findById(newVacancyOnServer.manager);
        
        if (!manager) {
          return new NextResponse(
            JSON.stringify({ message: "Менеджер не найден" }),
            { status: 404 }
          );
        }
  
        await Manager.findByIdAndUpdate(
          body.manager,
          { $addToSet: { vacancy: newVacancyOnServer._id } }, 
          { new: true }
        );
      }
  
      return new NextResponse(
        JSON.stringify({ message: "Новая вакансия создана успешно", partner: newVacancyOnServer }),
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
  