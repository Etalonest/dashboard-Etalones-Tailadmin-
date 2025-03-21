import { connectDB } from '@/src/lib/db';
import Partner from '@/src/models/Partner';
import { CommentEntry, } from '@/src/components/forms/interfaces/FormCandidate.interface';
import { NextResponse } from 'next/server';
import Document from '@/src/models/Document';
import { ProfessionPartner } from '@/src/types/professionParnter';

interface PartnerI {
  salaryWorker: any;
  sum: any;
  typeC: any;
  location: any;
  contract: any;
  viber: any;
  telegram: any;
  whatsapp: any;
  email: any;
  companyName: any;
  numberDE: any;
  manager?: any;
  site?: string;
  citizenship?: string;
  locations?: string;
  phone?: string;
  name?: string;
  _id?: string;
  partners?: string;
  comment?: CommentEntry[];
  professions?: ProfessionPartner[];
  documents?: {
    docType?: any;
    dateExp?: any;
    dateOfIssue?: any;
    numberDoc?: any; 
    file?: string 
}[];
}
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  await connectDB();

  try {
    // Получаем форму данных
    const formData = await request.formData();
    console.log("FORMDATA", formData);

    const oldPartner = await Partner.findById(id).lean() as PartnerI | null;

    if (!oldPartner) {
      return NextResponse.json({ message: "Такой партнёр не найден" }, { status: 404 });
    }

    // Получаем новое имя (если оно передано в форме)
    const newName = formData.get('name') ? formData.get('name') as string : oldPartner.name;
    const newPhone = formData.get('phone') ? formData.get('phone') as string : oldPartner.phone;
    const newViber = formData.get('viber') ? formData.get('viber') as string : oldPartner.viber;
    const newTelegram = formData.get('telegram') ? formData.get('telegram') as string : oldPartner.telegram;
    const newWhatsapp = formData.get('whatsapp') ? formData.get('whatsapp') as string : oldPartner.whatsapp;
    const newEmail = formData.get('email') ? formData.get('email') as string : oldPartner.email;
    const newCompanyName = formData.get('companyName') ? formData.get('companyName') as string : oldPartner.companyName;
    const newNumberDE = formData.get('numberDE') ? formData.get('numberDE') as string : oldPartner.numberDE;
    const newSite = formData.get('site') ? formData.get('site') as string : oldPartner.site;
    const newLocation = formData.get('location') ? formData.get('location') as string : oldPartner.location;
    const newManager = formData.get('manager') ? formData.get('manager') : oldPartner.manager;

    const workStatusesData = JSON.parse(formData.get('workStatuses') as string);
    const contractString = formData.get('contract') as string;
    let contract;
    try {
      contract = JSON.parse(contractString);
    } catch (error) {
      console.error("Ошибка при парсинге contract:", error);
      contract = {
        typeC: "Почасовый",
        sum: "22 EUR",
        salaryWorker: "12 EUR/час"
      };
    }

    const commentData = formData.get('comment');
    let newComment = [];

    if (commentData) {
      try {
        newComment = JSON.parse(commentData as string);
      } catch (error) {
        console.error("Invalid JSON in comment field", error);
        // Обработка ошибки, например, установка пустого массива или сообщение об ошибке
      }
    }
    
    let professionsData = [];
    const professionsDataField = formData.get('professions');
    if (professionsDataField) {
      try {
        professionsData = JSON.parse(professionsDataField as string);
      } catch (error) {
        console.error("Invalid JSON in professions field", error);
      }
    }

    const documentEntries = JSON.parse(formData.get('documents') as string);
    console.log("Received document entries:", documentEntries);
    const documentsData = []; 
    const documentsFileData = [];  
    for (let i = 0; i < documentEntries.length; i++) {
      const doc = documentEntries[i];
      const file = formData.get(`documents[${i}][file]`);
      
      console.log(`Processing document ${i}:`, doc);

      // Проверяем, существует ли документ с таким типом уже в базе
      const existingDocument = oldPartner.documents?.find(d => d.docType === doc.docType);

      if (file && file instanceof Blob) {
        console.log(`File received: ${file.name} (${file.type})`);

        // Преобразуем файл в буфер
        const bufferData = await file.arrayBuffer();
        const buffer = Buffer.from(bufferData);

        const document = new Document({
          name: file.name, // Имя файла
          data: buffer,    // Данные файла
          contentType: file.type,  // Тип контента файла
        });

        const savedDocument = await document.save();

        console.log(`Document saved with ID: ${savedDocument._id}`);

        // Добавляем ID файла в массив документов
        documentsData.push({
          docType: doc.docType || '',
          dateExp: doc.dateExp || '',
          dateOfIssue: doc.dateOfIssue || '',
          numberDoc: doc.numberDoc || '',
          file: savedDocument._id,  
        });
        documentsFileData.push(savedDocument._id);
      } else if (existingDocument) {
        // Если документ с таким типом уже существует, используем его
        console.log(`Document with type ${doc.docType} already exists. Using existing document.`);
        documentsData.push({
          docType: doc.docType || existingDocument.docType,
          dateExp: doc.dateExp || existingDocument.dateExp,
          dateOfIssue: doc.dateOfIssue || existingDocument.dateOfIssue,
          numberDoc: doc.numberDoc || existingDocument.numberDoc,
          file: existingDocument.file,  // Используем существующий файл
        });
      } else {
        // Если файла нет и документа такого типа еще нет, добавляем новый
        console.log(`Adding new document ${i} without file:`, doc);
        documentsData.push({
          docType: doc.docType || '',
          dateExp: doc.dateExp || '',
          dateOfIssue: doc.dateOfIssue || '',
          numberDoc: doc.numberDoc || '',
          file: null,  // Если файл не передан, сохраняем null
        });
      }
    }

    console.log("Documents to be saved:", documentsData);

    const updatedPartner = await Partner.findByIdAndUpdate(id, {
      $set: {
        name: newName,
        phone: newPhone,
        viber: newViber,
        telegram: newTelegram,
        whatsapp: newWhatsapp,
        email: newEmail,
        companyName: newCompanyName,
        numberDE: newNumberDE,
        site: newSite,
        location: newLocation,
        manager: newManager,
        documents: documentsData || oldPartner.documents,
        contract: contract || oldPartner.contract,
        statusWork: workStatusesData,
        professions: professionsData,
      },
      $push: {
        comment: newComment, 
      },
      $addToSet: {
        documentsFile: { $each: documentsFileData },
      },
    }, { new: true });

    console.log('Partner updated:', updatedPartner);

    return NextResponse.json({
      message: "Partner обновлён",
      content: "",
      success: true,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error processing the request:', error);
    return NextResponse.json({
      message: 'Error processing request',
      error: error.message
    }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  // Логируем поступивший id
  console.log("Получен id партнёра:", id);

  try {
    // Подключаемся к базе данных
    await connectDB();
    console.log("Успешно подключено к базе данных");

    // Ищем партнёра по id и заполняем связанные данные
    const partner = await Partner.findById(id)
      .populate(['manager',])
      .lean() as PartnerI | null;

    // Логируем, если партнёр найден или не найден
    if (!partner) {
      console.log(`Партнёр с id ${id} не найден`);
      return NextResponse.json({ message: "Candidate not found" }, { status: 404 });
    }

    console.log(`Партнёр с id ${id} найден:`, partner);
    return NextResponse.json({ partner }, { status: 200 });
  } catch (error: any) {
    // Логируем ошибку, если она произошла
    console.error("Ошибка при получении партнёра:", error);
    return NextResponse.json({ message: "Ошибка при загрузке данных", error: error.message }, { status: 500 });
  }
}