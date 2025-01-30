import { IncomingForm } from 'formidable';
import { connectDB } from '@/src/lib/db';
import  Candidate  from '@/src/models/Candidate';
import Partner from '@/src/models/Partner';
import Manager from '@/src/models/Manager';
import Document from '@/src/models/Document';
import { NextResponse } from 'next/server';
import { CommentEntry } from '@/src/components/forms/interfaces/FormCandidate.interface';
// Интерфейсы для типизации
interface CandidateUpdate {
  partners?: string;
  manager?: string;
  [key: string]: any;
}

interface CandidateDoc {
  manager?: any;
  ageNum?: string;
  citizenship?: string;
  locations?: string;
  phone?: string;
  name?: string;
  _id?: string;
  partners?: string;
  comment?: CommentEntry[];
  documents?: {
    docType?: any;
    dateExp?: any;
    dateOfIssue?: any;
    numberDoc?: any; 
    file?: string 
}[];
}
// както работадло имено для файла
// export async function PUT(request: Request, { params }: { params: { id: string } }) {
//   const { id } = params;
//   await connectDB();

//   try {
//     // Получаем форму данных
//     const formData = await request.formData();
//   console.log("FORMDATA", formData)

//     // Получаем старого кандидата
//     const oldCandidate = await Candidate.findById(id).lean() as CandidateDoc | null;

//     if (!oldCandidate) {
//       return NextResponse.json({ message: "Candidate not found" }, { status: 404 });
//     }

//     console.log(`Old Candidate Retrieved: ${JSON.stringify(oldCandidate)}`);

//     const documentEntries = JSON.parse(formData.get('documents') as string);
//     const documentsData = [];

//     for (let i = 0; i < documentEntries.length; i++) {
//       const doc = documentEntries[i];
//       const file = formData.get(`documents[${i}][file]`);

//       if (file && file instanceof Blob) {
//         console.log(`File received: ${file.name} (${file.type})`);

//         // Преобразуем файл в буфер
//         const bufferData = await file.arrayBuffer();
//         const buffer = Buffer.from(bufferData);

//         // Сохраняем файл в коллекции документов
//         const document = new Document({
//           name: file.name, // Имя файла
//           data: buffer,    // Данные файла
//           contentType: file.type,  // Тип контента файла
//         });

//         const savedDocument = await document.save();

//         console.log(`Document saved with ID: ${savedDocument._id}`);

//         // Добавляем ID файла в массив документов
//         documentsData.push({
//           docType: doc.docType || '',
//           dateExp: doc.dateExp || '',
//           dateOfIssue: doc.dateOfIssue || '',
//           numberDoc: doc.numberDoc || '',
//           file: savedDocument._id,  // Сохраняем ID сохраненного файла
//         });
//       } else {
//         // Если нет файла, оставляем старые документы без изменений
//         const existingDoc = oldCandidate.documents?.[i];

//         if (existingDoc) {
//           documentsData.push({
//             docType: doc.docType || existingDoc.docType,
//             dateExp: doc.dateExp || existingDoc.dateExp,
//             dateOfIssue: doc.dateOfIssue || existingDoc.dateOfIssue,
//             numberDoc: doc.numberDoc || existingDoc.numberDoc,
//             file: existingDoc.file,  // Оставляем старое значение file
//           });
//         } else {
//           // Если это новый документ без файла, то добавляем его как новый
//           documentsData.push({
//             docType: doc.docType || '',
//             dateExp: doc.dateExp || '',
//             dateOfIssue: doc.dateOfIssue || '',
//             numberDoc: doc.numberDoc || '',
//             file: null,  // Если файл не передан, сохраняем null
//           });
//         }
//       }
//     }

//     // Обновляем кандидата в базе данных, добавляем новые документы
//     await Candidate.findByIdAndUpdate(id, {
//       $set: {
//         documents: documentsData, // Обновляем документы с правильными ID
//       },
//     }, { new: true });

//     console.log('Candidate document list updated in database');

//     return NextResponse.json({ message: "Candidate updated" }, { status: 200 });
//   } catch (error: any) {
//     console.error('Error processing the request:', error);
//     return NextResponse.json({ message: 'Error processing request', error: error.message }, { status: 500 });
//   }
// }
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  await connectDB();

  try {
    // Получаем форму данных
    const formData = await request.formData();
    console.log("FORMDATA", formData);

    const oldCandidate = await Candidate.findById(id).lean() as CandidateDoc | null;

    if (!oldCandidate) {
      return NextResponse.json({ message: "Candidate not found" }, { status: 404 });
    }

    console.log(`Old Candidate Retrieved: ${JSON.stringify(oldCandidate)}`);

    // Получаем новое имя (если оно передано в форме)
    const newName = formData.get('name') as string;
    const newPhone = formData.get('phone') as string
    const additionalPhones = formData.getAll('additionalPhones') as string[];
    const newAge = formData.get('ageNum') as string;
    const newCitizenship = formData.get('citizenship') as string;
    const newLocations = formData.get('locations') as string;
    const newManager = formData.get('manager') as any;
    const professionsData = JSON.parse(formData.get('professions') as string);
    const langueData = JSON.parse(formData.get('langue') as string)
    const drivePermisData = JSON.parse(formData.get('drivePermis') as string);
    let commentData: any[] = [];
const rawComment = formData.get('comment');
console.log('Полученные данные comment на сервере:', rawComment);

if (rawComment) {
  // Просто передаем rawComment как есть, если он существует
  if (Array.isArray(rawComment)) {
    commentData = rawComment;
  } else {
    commentData = [rawComment];
  }
  console.log('Комментарии переданы на сервер:', commentData);
}

  
    const newAdditionalPhones = additionalPhones
      .map(phone => {
        try {
          return JSON.parse(phone);
        } catch (error) {
          return phone;
        }
      })
      .flat()  
      .filter(phone => phone.trim() !== ''); 

    
    const documentEntries = JSON.parse(formData.get('documents') as string);
    const documentsData = [];

    for (let i = 0; i < documentEntries.length; i++) {
      const doc = documentEntries[i];
      const file = formData.get(`documents[${i}][file]`);

      if (file && file instanceof Blob) {
        console.log(`File received: ${file.name} (${file.type})`);

        // Преобразуем файл в буфер
        const bufferData = await file.arrayBuffer();
        const buffer = Buffer.from(bufferData);

        // Сохраняем файл в коллекции документов
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
          file: savedDocument._id,  // Сохраняем ID сохраненного файла
        });
      } else {
        // Если нет файла, оставляем старые документы без изменений
        const existingDoc = oldCandidate.documents?.[i];

        if (existingDoc) {
          documentsData.push({
            docType: doc.docType || existingDoc.docType,
            dateExp: doc.dateExp || existingDoc.dateExp,
            dateOfIssue: doc.dateOfIssue || existingDoc.dateOfIssue,
            numberDoc: doc.numberDoc || existingDoc.numberDoc,
            file: existingDoc.file,  // Оставляем старое значение file
          });
        } else {
          // Если это новый документ без файла, то добавляем его как новый
          documentsData.push({
            docType: doc.docType || '',
            dateExp: doc.dateExp || '',
            dateOfIssue: doc.dateOfIssue || '',
            numberDoc: doc.numberDoc || '',
            file: null,  // Если файл не передан, сохраняем null
          });
        }
      }
    }

    // Обновляем кандидата в базе данных, добавляем новое имя и документы
    const updatedCandidate = await Candidate.findByIdAndUpdate(id, {
      $set: {
        name: newName || oldCandidate.name, 
        ageNum: newAge || oldCandidate.ageNum,
        citizenship: newCitizenship || oldCandidate.citizenship,
        locations: newLocations || oldCandidate.locations,
        manager: newManager || oldCandidate.manager,
        phone: newPhone || oldCandidate.phone,
        additionalPhones: newAdditionalPhones,
        documents: documentsData,
        professions: professionsData,
        langue: langueData,
        drivePermis: drivePermisData,
      },
      $push: { comments: { $each: commentData } }, 
    }, { new: true });

    console.log('Candidate updated:', updatedCandidate);

    return NextResponse.json({ message: "Candidate updated" }, { status: 200 });
  } catch (error: any) {
    console.error('Error processing the request:', error);
    return NextResponse.json({ message: 'Error processing request', error: error.message }, { status: 500 });
  }
}





export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  await connectDB();

  const candidate = await Candidate.findById(id)
    .populate(['comment', 'manager', 'professions', 'langue', 'partners', 'tasks', 'documents','dialogs']) 
    .lean() as CandidateDoc | null;
  if (!candidate) {
    return NextResponse.json({ message: "Candidate not found" }, { status: 404 });
  }

  return NextResponse.json({ candidate }, { status: 200 });
}