import { NextResponse } from 'next/server';
import Candidate from "@/src/models/Candidate";
import EventLog from "@/src/models/EventLog";
import Manager from "@/src/models/Manager";
import Vacancies from "@/src/models/Vacancies";
import Stage from "@/src/models/Stage";
import { connectDB } from "@/src/lib/db";

const STAGE_SUCCESS = process.env.NEXT_PUBLIC_CANDIDATES_STAGE_INTERVIEW_SUCCESS;

export const POST = async (req: Request) => {
  try {
    await connectDB();
    const { candidateId, managerId, vacancyId, comment, date } = await req.json();
    
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
      { _id: { $ne: STAGE_SUCCESS } },
      { $pull: { candidates: candidateId } }
    );

    // Добавляем кандидата в стадию "прошел собеседование"
    await Stage.updateOne(
      { _id: STAGE_SUCCESS },
      { $addToSet: { candidates: candidateId } }
    );

    // Создаем событие отклонения
    const eventLog = new EventLog({
      eventType: 'Прошёл собеседование',
      relatedId: candidateId,
      responsible: vacancy.manager,
      appointed: managerId,
      vacancy: vacancyId,
      manager: managerId,
      date: date,
      description: `Кандидат: ${candidate.name} прошёл собеседование для вакансии "${vacancy.title}" в город ${vacancy.location}`,
      comment, 
    });

    await eventLog.save();

    await Promise.all([
      Candidate.updateOne({ _id: candidateId }, { $push: { stages: { $each: [STAGE_SUCCESS], $position: 0 } } }),
      Vacancies.updateOne(
        { _id: vacancyId },
        { $pull: { interviews: candidateId } }
      ),
      Manager.updateOne(
        { _id: managerId },
        { $pull: { candidateFromInterview: candidateId } }
      ),
      Manager.updateOne(
        { _id: managerId },
        { $push: { candidateRejected: { $each: [candidateId], $position: 0 } } }
      ),
      Vacancies.updateOne({ _id: vacancyId }, { $push: { events: { $each: [eventLog._id], $position: 0 } } }),

      Manager.updateOne({ _id: managerId }, { $push: { events: { $each: [eventLog._id], $position: 0 } } })
    ]);

    return NextResponse.json({ success: true, message: "Candidate rejected", eventId: eventLog._id }, { status: 201 });
  } catch (error) {
    console.error("Error rejecting candidate:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
};
