import { connectDB } from '@/src/lib/db';
import  Candidate  from '@/src/models/Candidate';
import Partner from '@/src/models/Partner';
import Manager from '@/src/models/Manager';
import Document from '@/src/models/Document';
import { NextResponse } from 'next/server';
import { CommentEntry } from '@/src/components/forms/interfaces/FormCandidate.interface';


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

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  await connectDB();

  try {
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
    const newManager = formData.get('managerId') as any;
    console.log("NEWMANAGER", newManager);
    const professionsData = JSON.parse(formData.get('professions') as string);
    const langueData = JSON.parse(formData.get('langue') as string)
    const drivePermisData = JSON.parse(formData.get('drivePermis') as string);
    const workStatusesData = JSON.parse(formData.get('workStatuses') as string);

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
    const documentsFileData = [];
    for (let i = 0; i < documentEntries.length; i++) {
      const doc = documentEntries[i];
      const file = formData.get(`documents[${i}][file]`);

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
        statusWork: workStatusesData,
      },
      $push: {
        comment: newComment, 
      },
      $addToSet: {
        documentsFile: { $each: documentsFileData }, 
      },
    }, { new: true });

    console.log('Candidate updated:', updatedCandidate);

    return NextResponse.json({ message: "Candidate обновлён", content:"",success: true, }, { status: 200 });
  } catch (error: any) {
    console.error('Error processing the request:', error);
    return NextResponse.json({ message: 'Error processing request', error: error.message }, { status: 500 });
  }
}





export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  await connectDB();

  const candidate = await Candidate.findById(id)
    .populate(['manager', 'partners', 'tasks', 'documents','dialogs']) 
  if (!candidate) {
    return NextResponse.json({ message: "Candidate not found" }, { status: 404 });
  }

  return NextResponse.json({ candidate }, { status: 200 });
}