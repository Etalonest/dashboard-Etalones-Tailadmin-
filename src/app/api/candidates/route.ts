import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/db';
import  Candidate  from '@/src/models/Candidate';
import Manager from '@/src/models/Manager';
import Stage from '@/src/models/Stage';
import Task from '@/src/models/Task';
import EventLog from '@/src/models/EventLog';
import { ca } from 'date-fns/locale';


const STAGE_NEW = process.env.NEXT_PUBLIC_CANDIDATES_STAGE_NEW;
const STAGE_PROCESSING = process.env.NEXT_PUBLIC_CANDIDATES_STAGE_PROCESSING;

export const GET = async (request: NextRequest) => {
  
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '5', 10);

    const offset = (page - 1) * limit;

    const candidates = await Candidate.find({})
      .sort({ 'updatedAt': -1 })
      .skip(offset)
      .limit(limit)
      .populate(['manager','tasks', 'stages','documents', 'events']); 

    const totalCandidates = await Candidate.countDocuments({});
    const totalPages = Math.ceil(totalCandidates / limit);

    const response = {
      candidates,
      page,
      totalPages, 
      totalCandidates,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };

    return new NextResponse(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error("Error in fetching:", error);
    return new NextResponse("Error in fetching: " + error, { status: 500 });
  }
};



export const POST = async (request: Request) => {
  
  try {

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const ageNum = formData.get('ageNum') as string;
    const status = formData.get('status') as string;
    const citizenship = formData.get('citizenship') as string;
    const leaving = formData.get('leaving') as string;
    const locations = formData.get('locations') as string;
    const cardNumber = formData.get('cardNumber') as string;
    const statusWorkRaw = formData.get('statusWork');
    const statusWork = statusWorkRaw ? JSON.parse(statusWorkRaw as string) : [];
    const funnel = formData.get('funnel') as any;
    const documentsRaw = formData.get('documents');
    const documents = documentsRaw ? JSON.parse(documentsRaw as string) : [];
    const additionalPhones = JSON.parse(formData.get('additionalPhones') as string);

    const professionsRaw = formData.get('professions');
    const professions = professionsRaw ? JSON.parse(professionsRaw as string) : [];

    const managerId = formData.get('managerId'); 
    const commentRaw = formData.get('comment');
    
    const comment = commentRaw ? (Array.isArray(commentRaw) ? commentRaw : [commentRaw]).map(item => {
      try {
        const parsedItem = JSON.parse(item);
        if (parsedItem.author && parsedItem.text && parsedItem.date) {
          return parsedItem;
        } else {
          return {
            author: managerId,
            text: item,
            date: new Date().toISOString(),
          };
        }
      } catch (e) {
        return {
          author: managerId, 
          text: item,
          date: new Date().toISOString(),
        };
      }
    }) : [];
    
    
    const drivePermisRaw = formData.get('drivePermis');
    const drivePermis = drivePermisRaw ? JSON.parse(drivePermisRaw as string) : [];

    const langueRaw = formData.get('langue');
    const langue = langueRaw ? JSON.parse(langueRaw as string) : [];



   

    await connectDB();

    const existingCandidate = await Candidate.findOne({ phone });
    if (existingCandidate) {
      console.log('Кандидат с таким номером телефона уже существует:', existingCandidate);
      return new NextResponse(
        JSON.stringify({
          error: true,
          message: `Кандидат с таким номером телефона уже существует: ${name} ${phone}`,
          metadata: {
            candidateId: existingCandidate._id.toString(), 
          }, 
        }),
        { status: 400 }
      );
    }

    const newCandidate = new Candidate({
      name,
      phone,
      additionalPhones,
      ageNum,
      status,
      professions,
      documents,
      drivePermis,
      citizenship,
      leaving,
      langue,
      locations,
      cardNumber,
      comment,
      statusWork,
      funnel,
      manager: managerId,
    });


    await newCandidate.save();

    const stageNewId = STAGE_NEW;
const stageProcessingId = STAGE_PROCESSING;

if (stageNewId) {
  await Stage.findByIdAndUpdate(
    stageNewId,
    { $push: { candidates: newCandidate._id } },
    { new: true }
  );
}

if (stageProcessingId) {
  await Stage.findByIdAndUpdate(
    stageProcessingId,
    { $push: { candidates: newCandidate._id } },
    { new: true }
  );
}

    const eventLog = new EventLog({
      eventType: 'Добавлен кандидат',
      relatedId: newCandidate._id,
      manager: managerId,
      description: `Добавлен новый кандидат: ${name}`,
    });

    await eventLog.save();
    if (newCandidate.manager) {
      const manager = await Manager.findById(newCandidate.manager);
      if (manager) {
        await Manager.findByIdAndUpdate(manager._id, { $push: { candidates: { $each: [newCandidate._id], $position: 0 } } });
        await Manager.findByIdAndUpdate(manager._id, { $push: { events: { $each: [eventLog._id], $position: 0 } } });
      }
    }
   
    return new NextResponse(
      JSON.stringify({
        success: true,
        message: `Кандидат ${name} успешно создан`,
        candidate: newCandidate,
        metadata: newCandidate._id.toString()
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка при создании кандидата:', error);
    return new NextResponse(
      JSON.stringify({
        message: "Серверная ошибка при создании кандидата",
        error,
      }),
      { status: 500 }
    );
  }
};

