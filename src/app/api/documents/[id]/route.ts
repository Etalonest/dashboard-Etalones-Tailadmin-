import { NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/db';
import  Document  from '@/src/models/Document';
import  Candidate  from '@/src/models/Candidate'; // Подключаем модель кандидата



export const GET = async (request: any, { params }: any) => {
  const { id } = params;
  await connectDB();

  // Поиск документа по ID
  const document = await Document.findById(id);
  console.log("DOCUMENT", document)
  if (!document) {
      return new NextResponse(
          JSON.stringify({ success: false, message: 'Document not found' }),
          { status: 404 }
      );
  }

  if (!document.name || !document.data) {
      return new NextResponse(
          JSON.stringify({ success: false, message: 'File data is missing' }),
          { status: 400 }
      );
  }

  // Декодируем Base64 строку в бинарные данные
  const fileBuffer = Buffer.from(document.data, 'base64');

  // Отправляем файл в ответ
  return new NextResponse(fileBuffer, {
      headers: {
          'Content-Type': document.contentType,
          'Content-Disposition': `attachment; filename="${encodeURIComponent(document.name)}"`,
      },
  });
};

export const POST = async (request:any) => {
    try {
      console.log("Received request to create document");
  
      // Подключаемся к базе данных
      await connectDB();
      console.log("Connected to database");
  
      // Получаем данные формы
      const data = await request.formData();
      const file = data.get('file'); // Получаем файл
      const fileName = file.name;
      const fileType = file.type;
  
      // Проверка наличия файла
      if (!file) {
        return new NextResponse(
          JSON.stringify({ success: false, message: 'File is required' }),
          { status: 400 }
        );
      }
  
      // Преобразуем файл в Buffer
      const bufferData = await file.arrayBuffer();
      const buffer = Buffer.from(bufferData);
  
      // Создаем новый документ
      const newDocument = new Document({
        file: {
          name: fileName,
          data: buffer,
          contentType: fileType,
        },
      });
          const candidateId = data.get('candidateId') as string; // Приводим к типу string

      // Сохраняем документ в базе данных
      await newDocument.save();
      console.log("Document saved successfully with _id:", newDocument._id);
   // Находим кандидата и связываем документ с ним
        const candidate = await Candidate.findById(candidateId);
        if (!candidate) {
            console.error("Candidate not found with ID:", candidateId);
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Candidate not found' }),
                { status: 404 }
            );
        }

        console.log("Candidate found, linking document");

        // Добавляем документ в список документов кандидата
        candidate.documentsFile.push(newDocument._id);
        await candidate.save();

      return new NextResponse(
        JSON.stringify({ success: true, message: 'Document created successfully', document: newDocument }),
        { status: 201 }
      );
    } catch (error: any) {
      console.error("Error in POST request:", error);
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Error creating document', error: error.message }),
        { status: 500 }
      );
    }
  };
