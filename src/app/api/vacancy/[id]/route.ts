import { connectDB } from "@/src/lib/db";
import Vacancies from "@/src/models/Vacancies";
import { VacancyType } from "@/src/types/vacancy";
import { NextResponse } from "next/server";
import VacancyImages from "@/src/models/VacancyImages";
import HomeImages from "@/src/models/HomeImages";
import { processImage } from '@/src/lib/imageProcessor';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    await connectDB();
  
    try {
      // Получаем форму данных
      const formData = await request.formData();
      console.log("FORMDATA", formData);
  
      // Получаем старую вакансию
      const oldVacancy = await Vacancies.findById(id).lean() as VacancyType | null;
      if (!oldVacancy) {
        return NextResponse.json({ message: "Vacancy not found" }, { status: 404 });
      }
  
      console.log(`Old Vacancy Retrieved: ${JSON.stringify(oldVacancy)}`);
  
      // Получаем все новые данные
      const newTitle = formData.get('title') as string;
      const newPlace = formData.get('place') as string;
      const newSkills = formData.get('skills') as string;
      const newRoof_type = formData.get('roof_type') as string;
      const newLocation = formData.get('location') as string;
      const newSalary = formData.get('salary') as string;
      const newHomePrice = formData.get('homePrice') as string;
      const newHome_descr = formData.get('home_descr') as string;
      const newWork_descr = formData.get('work_descr') as string;
      const newGrafik = formData.get('grafik') as string;
      const newWorkHours = formData.get('workHours') as string;
      const newDocuments = JSON.parse(formData.get('documents') as string) || [];
      const newLangues = JSON.parse(formData.get('langue') as string);
      const drivePermisData = JSON.parse(formData.get('drivePermis') as string);
      
      const file = formData.get('image');
      let savedImage: any = null;  
      if (file && file instanceof Blob) {
        try {
          const existingImage = await VacancyImages.findOne({ name: file.name });
      
          if (existingImage) {
            savedImage = existingImage;
            console.log('Image already exists with ID:', savedImage._id);
          } else {
            // const bufferData = await file.arrayBuffer();  
            // const buffer = Buffer.from(bufferData);
            const processedImage = await processImage(file);

            const newImage = new VacancyImages({
              name: file.name,
              data: processedImage,
              contentType: file.type,
            });
      
            savedImage = await newImage.save();
            console.log('Image saved with ID:', savedImage._id);
          }
        } catch (error: any) {
          console.error('Error saving image:', error);
          return NextResponse.json({ message: 'Error saving image', error: error.message }, { status: 500 });
        }
      }
      
      let savedHomeImages: any[] = []; // Массив для хранения ID изображений жилья

      const homeImages = formData.getAll('homeImages');
      if (homeImages.length > 0) {
        try {
          for (const file of homeImages) {
            if (file instanceof Blob) {
              // Проверяем, существует ли уже изображение с таким именем
              const existingHomeImage = await HomeImages.findOne({ name: file.name });
      
              if (existingHomeImage) {
                // Если изображение найдено, используем его ID
                savedHomeImages.push(existingHomeImage._id);
                console.log('Home image already exists with ID:', existingHomeImage._id);
              } else {
                // Если изображения нет, сохраняем новое
                const bufferData = await file.arrayBuffer();  // Преобразуем файл в буфер
                const buffer = Buffer.from(bufferData);
      
                const newHomeImage = new HomeImages({
                  name: file.name,
                  data: buffer,
                  contentType: file.type,
                });
      
                // Сохраняем изображение в коллекцию HomeImages
                const savedHomeImage = await newHomeImage.save();
                console.log('Home image saved with ID:', savedHomeImage._id);
      
                // Добавляем ID изображения жилья в массив
                savedHomeImages.push(savedHomeImage._id);
              }
            }
          }
        } catch (error: any) {
          console.error('Error saving home images:', error);
          return NextResponse.json({ message: 'Error saving home images', error: error.message }, { status: 500 });
        }
      }
      
      // Обновление вакансии
      try {
        const updatedVacancy = await Vacancies.findByIdAndUpdate(id, {
          $set: {
            title: newTitle || oldVacancy.title,
            place: newPlace || oldVacancy.place,
            skills: newSkills || oldVacancy.skills,
            roof_type: newRoof_type || oldVacancy.roof_type,
            location: newLocation || oldVacancy.location,
            salary: newSalary || oldVacancy.salary,
            homePrice: newHomePrice || oldVacancy.homePrice,
            home_descr: newHome_descr || oldVacancy.home_descr,
            work_descr: newWork_descr || oldVacancy.work_descr,
            grafik: newGrafik || oldVacancy.grafik,
            drivePermis: drivePermisData || oldVacancy.drivePermis,
            langue: newLangues || oldVacancy.langue,
            workHours: newWorkHours || oldVacancy.workHours,
            documents: newDocuments || oldVacancy.pDocs,
          },
        homeImages: savedHomeImages.length > 0 ? savedHomeImages : oldVacancy.homeImages,
         image: savedImage ? savedImage._id : oldVacancy.image,
        }, { new: true });
  
        console.log('Vacancy updated:', updatedVacancy);
        return NextResponse.json({ message: "Вакансия обновлена", content: "", success: true }, { status: 200 });
      } catch (error : any) {
        console.error('Ошибка при обновлении вакансии:', error);
        return NextResponse.json({ message: 'Ошибка при обновлении вакансии', error: error.message }, { status: 500 });
      }
  
    } catch (error: any) {
      console.error('Error processing the request:', error);
      return NextResponse.json({ message: 'Error processing request', error: error.message }, { status: 500 });
    }
  }
  



export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    await connectDB();
  
    const vacancy = await Vacancies.findById(id)
      .populate(["image", "homeImages", "partner", "manager"])
      .lean() as any | null;
    if (!vacancy) {
      return NextResponse.json({ message: "Vacancy not found" }, { status: 404 });
    }
  
    return NextResponse.json({ vacancy }, { status: 200 });}

