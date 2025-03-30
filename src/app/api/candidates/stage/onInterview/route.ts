import { NextResponse } from 'next/server';
import Candidate from "@/src/models/Candidate";
import EventLog from "@/src/models/EventLog";
import Manager from "@/src/models/Manager";
import Vacancies from "@/src/models/Vacancies";
import Stage from "@/src/models/Stage";
import { connectDB } from "@/src/lib/db";

const STAGE_ON_INTERVIEW = process.env.NEXT_PUBLIC_CANDIDATES_STAGE_ON_INTERVIEW;

export const POST = async (req: Request) => {
  try {
    await connectDB();
    const { candidateId, managerId, vacancyId, comment } = await req.json();
    
    console.log("REQUEST BODY:", { candidateId, managerId, vacancyId, comment });
    
    if (!candidateId || !managerId || !vacancyId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    const [vacancy, manager, candidate] = await Promise.all([
      Vacancies.findById(vacancyId),
      Manager.findById(managerId),
      Candidate.findById(candidateId)
    ]);
    
    if (!vacancy) return NextResponse.json({ error: "Vacancy not found" }, { status: 404 });
    if (!manager) return NextResponse.json({ error: "Manager not found" }, { status: 404 });
    if (!candidate) return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
    
    // Удаляем кандидата из всех стадий, кроме "Кандидаты на собеседовании"
    await Stage.updateMany(
      { _id: { $ne: STAGE_ON_INTERVIEW } },
      { $pull: { candidates: candidateId } }
    );

    // Добавляем кандидата в "Кандидаты на собеседовании", если его там нет
    await Stage.updateOne(
      { _id: STAGE_ON_INTERVIEW },
      { $addToSet: { candidates: candidateId } }
    );
    
    const eventLog = new EventLog({
      eventType: 'На собеседование',
      relatedId: candidateId,
      responsible: vacancy.manager,
      appointed: managerId,
      vacancy: vacancyId,
      manager: managerId,
      description: `Кандидат: ${candidate.name} передан на собеседование вакансии "${vacancy.title}" в город ${vacancy.location}`,
      comment,
    });
    
    await eventLog.save();
    await Promise.all([
        Candidate.updateOne({ _id: candidateId }, { $push: { events: eventLog._id } }),
        Vacancies.updateOne({ _id: vacancyId }, { $push: { events: eventLog._id } }),
        Manager.updateOne({ _id: managerId }, { $push: { events: eventLog._id } })
      ]);
  
    return NextResponse.json({ success: true, message: "Interview scheduled", eventId: eventLog._id }, { status: 201 });
  } catch (error) {
    console.error("Error scheduling interview:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
};
