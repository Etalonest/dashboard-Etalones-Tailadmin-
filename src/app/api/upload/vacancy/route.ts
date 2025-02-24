// src/app/api/upload/vacancy/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/src/lib/firebase'; // Импортируйте ваш firebase конфиг
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; 

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    const fileRef = ref(storage, `uploads/${file.name}`);

    const uploadTask = uploadBytesResumable(fileRef, file);

    await uploadTask;

    const fileUrl = await getDownloadURL(fileRef);

    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error uploading file' }, { status: 500 });
  }
};
