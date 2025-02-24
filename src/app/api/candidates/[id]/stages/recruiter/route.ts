// app/api/candidates/[candidateId]/stages/curator/route.js

import { connectDB } from '@/src/lib/db'; 
import Stage from '@/src/models/Stage';
import Candidate from '@/src/models/Candidate'; 

export async function POST(req : any, { params }: any) {
  try {
    const { candidateId } = params; 
    const { status, responsible, comment, vacancy } = await req.json(); 

    await connectDB();

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return new Response(
        JSON.stringify({ error: 'Кандидат не найден' }),
        { status: 404 }
      );
    }

    const newStage = new Stage({
      stage: 'recruiter', 
      status: status, 
      candidate: candidateId, 
      responsible: responsible, 
      comment: comment, 
      vacancy: vacancy, 
    });
 
    await newStage.save();

    candidate.stages = newStage._id;
    candidate.status = 'Рекрутируется'; 
    await candidate.save();
console.log("candidate", candidate);
    return new Response(
      JSON.stringify({
        message: 'Этап куратор успешно добавлен',
        candidate: { id: candidateId, name: candidate.name },
        stage: newStage,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Ошибка при добавлении этапа:', error);
    return new Response(
      JSON.stringify({ error: 'Ошибка при добавлении этапа' }),
      { status: 500 }
    );
  }
}
