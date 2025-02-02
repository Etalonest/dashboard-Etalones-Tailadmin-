// src/app/api/partner-by-manager/[id]/route.ts

import { connectDB } from '@/src/lib/db'; // Подключаемся к базе данных
import Partner from '@/src/models/Partner'; // Импортируем модель партнёра
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params; // Получаем id менеджера из параметров запроса

  try {
    await connectDB(); // Подключаемся к базе данных

    // Ищем партнёров, у которых указан данный менеджер
    const partners = await Partner.find({ manager: id })
    .populate({
      path: 'documents',
      options: { sort: { updatedAt: -1 } },
      populate: [
        {
          path: 'file',
          select: 'name contentType data',
        }
      ]
    })

    if (!partners || partners.length === 0) {
      return NextResponse.json({ message: 'Партнёры не найдены' }, { status: 404 });
    }

    return NextResponse.json({ partners }, { status: 200 });
  } catch (error: any) {
    console.error('Ошибка при получении партнёров:', error);
    return NextResponse.json({ message: 'Ошибка при получении партнёров', error: error.message }, { status: 500 });
  }
}
