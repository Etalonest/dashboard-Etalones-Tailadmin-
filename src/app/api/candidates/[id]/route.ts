import { connectDB } from '@/src/lib/db';
import  Candidate  from '@/src/models/Candidate';
import Partner from '@/src/models/Partner';
import Manager from '@/src/models/Manager';
import { NextResponse } from 'next/server';
import { CommentEntry } from '@/src/components/forms/interfaces/FormCandidate.interface';

// Интерфейсы для типизации
interface CandidateUpdate {
  partners?: string;
  manager?: string;
  [key: string]: any;
}

interface CandidateDoc {
  _id: string;
  partners?: string;
  manager?: string;
  comment?: CommentEntry[];
  // Добавьте другие поля, если необходимо
}
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    // Получаем тело запроса
    const body = await request.json();
    console.log('Request Body:', body);  // Логируем тело запроса

    // Подключаемся к базе данных
    await connectDB();

    // Получаем старого кандидата
    const oldCandidate = await Candidate.findById(id).lean() as CandidateDoc | null;

    if (!oldCandidate) {
      return NextResponse.json({ message: "Candidate not found" }, { status: 404 });
    }

    // Обновляем информацию о комментариях
    if (body.comment) {
      // Если у старого кандидата уже есть комментарии, добавляем новый
      if (Array.isArray(oldCandidate.comment)) {
        oldCandidate.comment.push(...body.comment);
      } else {
        // Если комментариев нет, создаем новый массив
        oldCandidate.comment = body.comment;
      }
    }

    // Обновляем кандидата, включая обновленный массив комментариев
    await Candidate.findByIdAndUpdate(id, {
      ...body,  // Все остальные поля из body
      comment: oldCandidate.comment,  // Обновляем комментарии
    }, { new: true });

    return NextResponse.json({ message: "Candidate updated" }, { status: 200 });
  } catch (error: any) {
    console.error('Error parsing JSON or processing the request:', error);
    return NextResponse.json({ message: 'Error processing request', error: error.message }, { status: 500 });
  }
}

// export async function PUT(request: Request, { params }: { params: { id: string } }) {
//   const { id } = params;
//   try {
//     const body = await request.json();
//     console.log('Request Body:', body);  // Логируем тело запроса

//     await connectDB();

//     // Получаем старого кандидата
//     const oldCandidate = await Candidate.findById(id).lean() as CandidateDoc | null;

//     if (!oldCandidate) {
//       return NextResponse.json({ message: "Candidate not found" }, { status: 404 });
//     }

//     // Обновляем информацию о кандидате
//     await Candidate.findByIdAndUpdate(id, body, { new: true });

//     // Логика с партнерами и менеджерами остаётся без изменений...

//     return NextResponse.json({ message: "Candidate updated" }, { status: 200 });
//   } catch (error: any) {
//     console.error('Error parsing JSON or processing the request:', error);
//     return NextResponse.json({ message: 'Error processing request', error: error.message }, { status: 500 });
//   }
// }


export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  await connectDB();

  const candidate = await Candidate.findById(id)
    .populate(['comment', 'manager', 'professions', 'langue', 'partners', 'tasks', 'documents', 'documentsFile']) // Добавили documents
    .lean() as CandidateDoc | null;

  if (!candidate) {
    return NextResponse.json({ message: "Candidate not found" }, { status: 404 });
  }

  return NextResponse.json({ candidate }, { status: 200 });
}