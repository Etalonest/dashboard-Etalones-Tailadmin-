// /app/api/files/[id]/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/db'; // Подключение к базе данных
import  Document from '@/src/models/Document'; // Импорт модели File
export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
  
    try {
      await connectDB();
  
      const file = await Document.findById(id);
  
      if (!file) {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
      }
  
      return NextResponse.json({
        name: file.name,
        data: file.data,        
        contentType: file.contentType,
      });
    } catch (error) {
      console.error('Error fetching file:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
