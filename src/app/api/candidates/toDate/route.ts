import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/db';
import Candidate from '@/src/models/Candidate';

export const GET = async (request: NextRequest) => {
  try {
    await connectDB(); 

    const { searchParams } = new URL(request.url);

    // Получаем параметры начала и конца периода
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Убедимся, что даты валидны
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    // Формируем запрос для фильтрации по датам
    let filter = {};

    if (start && end) {
      filter = {
        createdAt: { $gte: start, $lte: end }, // Фильтруем по диапазону дат
      };
    } else if (start) {
      filter = {
        createdAt: { $gte: start }, // Только после startDate
      };
    } else if (end) {
      filter = {
        createdAt: { $lte: end }, // Только до endDate
      };
    }

    // Получаем кандидатов за период
    const candidates = await Candidate.find(filter)
    .sort({ 'updatedAt': -1 })
    .populate([
      'manager',
      'documents',
      {
        path: 'stages',
        populate: [
          {
            path: 'tasks',
            model: 'Task',
          },
          {
            path: 'responsible',  
            model: 'Manager',     
          }
        ],
      },
    ]);
  
  

    return new NextResponse(JSON.stringify({ candidates }), { status: 200 });
  } catch (error) {
    console.error('Error in fetching candidates:', error);
    return new NextResponse('Error in fetching candidates: ' + error, { status: 500 });
  }
};
