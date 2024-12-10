import { connectToDB } from '@/app/lib/utils';
import { Candidate, Partner, Manager } from '@/app/lib/models';
import { NextResponse } from 'next/server';

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
  // Добавьте другие поля, если необходимо
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const body: CandidateUpdate = await request.json();

  await connectToDB();

  // Получаем старого кандидата
  const oldCandidate = await Candidate.findById(id).lean() as CandidateDoc | null;

  // Проверяем, существует ли старый кандидат
  if (!oldCandidate) {
    return NextResponse.json({ message: "Candidate not found" }, { status: 404 });
  }

  // Обновляем информацию о кандидате
  await Candidate.findByIdAndUpdate(id, body, { new: true });

  // Если партнер изменился, обновляем массив candidates у старого и нового партнеров
  if (body.partners && oldCandidate.partners !== body.partners) {
    // Удаляем кандидата из старого партнера
    if (oldCandidate.partners) {
      await Partner.findByIdAndUpdate(oldCandidate.partners, { $pull: { candidates: id } });
    }
    // Добавляем кандидата в новый партнер
    await Partner.findByIdAndUpdate(body.partners, { $addToSet: { candidates: id } });
  }

  // Обновляем массив кандидатов у менеджера
  if (body.manager && oldCandidate.manager && oldCandidate.manager.toString() !== body.manager) {
    const oldManager = await Manager.findById(oldCandidate.manager);
    if (oldManager) {
      await Manager.findByIdAndUpdate(oldManager._id, { $pull: { candidates: id } });
    }
  }

  if (body.manager) {
    const newManager = await Manager.findById(body.manager);
    if (newManager) {
      await Manager.findByIdAndUpdate(body.manager, { $addToSet: { candidates: id } });
    }
  }

  return NextResponse.json({ message: "Candidate updated" }, { status: 200 });
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  await connectToDB();

  const candidate = await Candidate.findById(id)
    .populate(['comment', 'manager', 'professions', 'langue', 'partners', 'tasks', 'documents', 'documentsFile']) // Добавили documents
    .lean() as CandidateDoc | null;

  if (!candidate) {
    return NextResponse.json({ message: "Candidate not found" }, { status: 404 });
  }

  return NextResponse.json({ candidate }, { status: 200 });
}