// // src/app/api/partner-by-manager/[id]/route.ts

import { connectDB } from '@/src/lib/db'; // Подключаемся к базе данных
import Candidate from '@/src/models/Candidate'; // Импортируем модель партнёра
import { NextResponse } from 'next/server';

// export async function GET(request: Request, { params }: { params: { id: string } }) {
//   const { id } = params; // Получаем id менеджера из параметров запроса

//   try {
//     await connectDB(); // Подключаемся к базе данных

//     // Ищем партнёров, у которых указан данный менеджер
//     const candidates = await Candidate.find({ manager: id })
//     .sort({ 'updatedAt': -1 })  // Сортируем по дате создания (если необходимо)
//     .populate({
//       path: 'documents',
//       options: { sort: { updatedAt: -1 } },
//       populate: [
//         {
//           path: 'file',
//           select: 'name contentType data',
//         }
//       ]
//     })

//     if (!candidates || candidates.length === 0) {
//       return NextResponse.json({ message: 'Партнёры не найдены' }, { status: 404 });
//     }

//     return NextResponse.json({ candidates }, { status: 200 });
//   } catch (error: any) {
//     console.error('Ошибка при получении партнёров:', error);
//     return NextResponse.json({ message: 'Ошибка при получении партнёров', error: error.message }, { status: 500 });
//   }
// }
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    await connectDB();
    const candidates = await Candidate.find({ manager: id }).sort({ 'updatedAt': -1 })
    .populate({
            path: 'documents',
            options: { sort: { updatedAt: -1 } },
            populate: [
              {
                path: 'file',
                select: 'name contentType',
              }
            ]
          })
    if (!candidates || candidates.length === 0) {
      return NextResponse.json({ message: 'Кандидаты не найдены' }, { status: 404 });
    }
    return NextResponse.json({ candidates }, { status: 200 });
  } catch (error: any) {
    console.error('Ошибка при получении кандидатов:', error);
    return NextResponse.json({ message: 'Ошибка при получении кандидатов', error: error.message }, { status: 500 });
  }
}
