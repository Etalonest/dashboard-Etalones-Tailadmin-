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
interface Document {
  docType: string;
  dateOfIssue: string;
  dateExp: string;
  numberDoc: string;
  documentsFile?: File;
}

export const POST = async (request: Request) => {
  try {
    const formData = await request.formData(); // Получаем данные из формы

    // Читаем поля формы
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const ageNum = formData.get('ageNum') as string;
    const status = formData.get('status') as string;
    const citizenship = formData.get('citizenship') as string;
    const leaving = formData.get('leaving') as string;
    const locations = formData.get('locations') as string;
    const cardNumber = formData.get('cardNumber') as string;
    const comment = formData.get('comment') ? [{
      text: formData.get('comment') as string,
      date: new Date()
    }] : [];
    const managerId = formData.get('manager') as string;

    // Обрабатываем документы
    const documents: Document[] = [];  // Явно указываем тип
    const documentEntries = formData.getAll('documents'); // Получаем все документы

    documentEntries.forEach((doc) => {
      if (doc instanceof File) {
        // Если это файл, добавляем его в массив
        documents.push({
          docType: '', // Пример данных, их нужно заполнить из других полей
          dateOfIssue: '',
          dateExp: '',
          numberDoc: '',
          documentsFile: doc, // Добавляем файл
        });
      } else {
        // Если это строка (например, JSON строка), парсим её
        const parsedDoc = JSON.parse(doc as string);
        documents.push(parsedDoc);
      }
    });

    // Дополнительные данные для кандидата
    const additionalPhones = formData.getAll('additionalPhones') as string[];
    const professions = formData.getAll('professions') as string[];
    const drivePermis = formData.get('drivePermis') as string;
    const langues = formData.getAll('langues') as string[];

    await connectDB();

    // Проверяем, существует ли кандидат с таким номером телефона
    const existingCandidate = await Candidate.findOne({ phone });
    if (existingCandidate) {
      return new NextResponse(
        JSON.stringify({
          error: true,
          message: `Кандидат с таким номером телефона уже существует ${name} ${phone}`, 
        }),
        {
          status: 400,
        }
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
      langues,
      locations,
      cardNumber,
      comment,
      manager: managerId,
    });

    await newCandidate.save();

    // Если у кандидата есть менеджер, добавляем его в массив кандидатов менеджера
    if (newCandidate.manager) {
      const manager = await Manager.findById(newCandidate.manager);
      if (manager) {
        await Manager.findByIdAndUpdate(manager._id, { $addToSet: { candidates: newCandidate._id } });
      }
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: `Кандидат ${name} успешно создан`, 
        candidate: newCandidate
      }),
      { status: 201 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        message: "Серверная ошибка при создании кандидата",
        error,
      }),
      {
        status: 500,
      }
    );
  }
};

