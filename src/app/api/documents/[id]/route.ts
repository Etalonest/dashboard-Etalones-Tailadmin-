import { NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/db';
import  Document  from '@/src/models/Document';
import  Candidate  from '@/src/models/Candidate'; // Подключаем модель кандидата



export const GET = async (request: any, { params }: any) => {
  const { id } = params;
  await connectDB();

  // Поиск документа по ID
  const document = await Document.findById(id);
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
// import { NextResponse } from 'next/server'
// import { storage, db } from '@/src/lib/firebase'; // Путь к вашему firebase.js
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import { collection, addDoc, doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

// export const POST = async (request: any) => {
//     try {
//         console.log("Received request to create document");

//         const data = await request.formData();
//         const file = data.get('file');
//         const candidateId = data.get('candidateId') as string;

//         if (!file) {
//             return new NextResponse(JSON.stringify({ success: false, message: 'File is required' }), { status: 400 });
//         }

//         const fileName = file.name;
//         const fileType = file.type;
//         const storageRef = ref(storage, `candidates/${candidateId}/${fileName}`); // Уникальное имя файла

//         const uploadTask = uploadBytesResumable(storageRef, await file.arrayBuffer());

//         uploadTask.on('state_changed',
//             (snapshot) => {
//                 // Observe state change events such as progress, pause, and resume
//                 // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
//                 const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//                 console.log('Upload is ' + progress + '% done');
//                 switch (snapshot.state) {
//                     case 'paused':
//                         console.log('Upload is paused');
//                         break;
//                     case 'running':
//                         console.log('Upload is running');
//                         break;
//                 }
//             },
//             (error) => {
//                 // Handle unsuccessful uploads
//                 console.error("Error uploading file:", error);
//                 return new NextResponse(JSON.stringify({ success: false, message: 'Error uploading file', error: error.message }), { status: 500 });

//             },
//             () => {
//                 // Handle successful uploads on complete
//                 // Get the download URL
//                 getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
//                     console.log('File available at', downloadURL);

//                     // Добавляем запись в Firestore
//                     await addDoc(collection(db, 'documents'), {
//                         candidateId: candidateId,
//                         fileName: fileName,
//                         fileType: fileType,
//                         downloadURL: downloadURL
//                     });
//                     console.log("Document saved successfully");

//                     // Обновляем документ кандидата в Firestore
//                     const candidateRef = doc(db, 'candidates', candidateId);
//                     await updateDoc(candidateRef, {
//                         documentsFile: arrayUnion({ fileName: fileName, downloadURL: downloadURL})
//                     });

//                     return new NextResponse(JSON.stringify({ success: true, message: 'Document created successfully', downloadURL: downloadURL }), { status: 201 });
//                 });
//             }
//         );


//     } catch (error: any) {
//         console.error("Error in POST request:", error);
//         return new NextResponse(JSON.stringify({ success: false, message: 'Error creating document', error: error.message }), { status: 500 });
//     }
// };
