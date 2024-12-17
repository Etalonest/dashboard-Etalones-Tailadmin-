import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/db';
import  Candidate  from '@/src/models/Candidate';
import Manager from '@/src/models/Manager';

export const GET = async (request: NextRequest) => {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '5', 10);

    const offset = (page - 1) * limit;

    const candidates = await Candidate.find({})
      .sort({ 'createdAt': -1 })
      .skip(offset)
      .limit(limit)
      .populate(['manager','tasks']); 

    const totalCandidates = await Candidate.countDocuments({});
    const totalPages = Math.ceil(totalCandidates / limit);

    const response = {
      candidates,
      page,
      totalPages, // Убедитесь, что это поле присутствует
      totalCandidates,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };

    return new NextResponse(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error("Error in fetching:", error);
    return new NextResponse("Error in fetching: " + error, { status: 500 });
  }
};
// export const POST = async (request: Request) => {
//   try {
//     const body = await request.json();

//     await connectDB();

//     // Проверяем, существует ли кандидат с таким номером телефона
//     const existingCandidate = await Candidate.findOne({ phone: body.phone },{name: body.name});
//     if (existingCandidate) {
//       return new NextResponse(
//         JSON.stringify({
//           error: true,
//           message: `Кандидат с таким номером телефона уже существует ${body.name} ${body.phone} `, 
//         }),
//         {
//           status: 400,
//         }
//       );
//     }

//     // Создаем нового кандидата
//     const newCandidate = new Candidate(body);
//     await newCandidate.save();

//     // Если у кандидата есть менеджер, добавляем его в массив кандидатов менеджера
//     if (newCandidate.manager) {
//       const manager = await Manager.findById(newCandidate.manager);
//       if (manager) {
//         await Manager.findByIdAndUpdate(manager._id, { $addToSet: { candidates: newCandidate._id } });
//       }
//     }

//     return new NextResponse(
//       JSON.stringify({
//          success: true,
//          message: `Кандидат ${body.name} успешно создан`, 
//          candidate: newCandidate }),
//       { status: 201 }
//     );
//   } catch (error) {
//     return new NextResponse(
//       JSON.stringify({
//         message: "Серверная ошибка при создании кандидата",
//         error,
//       }),
//       {
//         status: 500,
//       }
//     );
//   }
// };


export const POST = async (request: Request) => {
  try {

    const formData = await request.formData();
    console.log('Данные из формы:', formData);

    // Чтение полей формы
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const ageNum = formData.get('ageNum') as string;
    const status = formData.get('status') as string;
    const citizenship = formData.get('citizenship') as string;
    const leaving = formData.get('leaving') as string;
    const locations = formData.get('locations') as string;
    const cardNumber = formData.get('cardNumber') as string;
    
    console.log('Полученные значения:', { name, phone, ageNum, status, citizenship, leaving, locations, cardNumber });

    
    // Чтение массива документов
    const documentsRaw = formData.get('documents');
    const documents = documentsRaw ? JSON.parse(documentsRaw as string) : [];
    console.log('Документы:', documents);

    // Преобразуем строки в массивы для дополнительных данных
    const additionalPhones = JSON.parse(formData.get('additionalPhones') as string);
    console.log('Дополнительные телефоны:', additionalPhones);

    const professionsRaw = formData.get('professions');
    const professions = professionsRaw ? JSON.parse(professionsRaw as string) : [];
    console.log('Профессии:', professions);

    const commentRaw = formData.get('comment');
    const managerId = formData.get('managerId'); // Извлекаем ID менеджера из formData
    
    const comment = commentRaw ? (Array.isArray(commentRaw) ? commentRaw : [commentRaw]).map(item => {
      // Проверяем, является ли строка валидным JSON
      try {
        // Пытаемся распарсить как JSON (если это строка в формате JSON)
        const parsedItem = JSON.parse(item);
        // Если это объект, то считаем его правильным и возвращаем
        if (parsedItem.author && parsedItem.text && parsedItem.date) {
          return parsedItem;
        } else {
          // Если это не правильный объект, то создаем новый объект
          return {
            author: managerId, // Используем переданный ID менеджера
            text: item,
            date: new Date().toISOString(),
          };
        }
      } catch (e) {
        // Если не JSON, то просто считаем это текстом и создаем объект с этим текстом
        return {
          author: managerId, // Используем переданный ID менеджера
          text: item,
          date: new Date().toISOString(),
        };
      }
    }) : [];
    
    console.log('Комментарии:', comment);
    
    const drivePermisRaw = formData.get('drivePermis');
    const drivePermis = drivePermisRaw ? JSON.parse(drivePermisRaw as string) : [];
    console.log('Водительские права:', drivePermis);

    const langueRaw = formData.get('langue');
    const langue = langueRaw ? JSON.parse(langueRaw as string) : [];
    console.log('Языки:', langue);



   

    await connectDB();

    // Проверка, существует ли кандидат с таким номером телефона
    const existingCandidate = await Candidate.findOne({ phone });
    if (existingCandidate) {
      console.log('Кандидат с таким номером телефона уже существует:', existingCandidate);
      return new NextResponse(
        JSON.stringify({
          error: true,
          message: `Кандидат с таким номером телефона уже существует: ${name} ${phone}`,
        }),
        { status: 400 }
      );
    }

    // Создаем нового кандидата
    const newCandidate = new Candidate({
      name,
      phone,
      additionalPhones,
      ageNum,
      status,
      professions,
      documents,
      drivePermis,
      citizenship,
      leaving,
      langue,
      locations,
      cardNumber,
      comment,
      manager: managerId,
    });

    console.log('Создание кандидата:', newCandidate);

    await newCandidate.save();

    // Если у кандидата есть менеджер, обновляем его список кандидатов
    if (newCandidate.manager) {
      const manager = await Manager.findById(newCandidate.manager);
      if (manager) {
        await Manager.findByIdAndUpdate(manager._id, { $addToSet: { candidates: newCandidate._id } });
        console.log('Обновление менеджера с добавлением кандидата');
      }
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: `Кандидат ${name} успешно создан`,
        candidate: newCandidate,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Ошибка при создании кандидата:', error);
    return new NextResponse(
      JSON.stringify({
        message: "Серверная ошибка при создании кандидата",
        error,
      }),
      { status: 500 }
    );
  }
};

