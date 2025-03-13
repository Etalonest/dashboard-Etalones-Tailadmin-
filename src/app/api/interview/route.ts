import { NextResponse } from 'next/server';
import Interview from '@/src/models/Interview'; 
import { connectDB } from '@/src/lib/db';  
import Candidate from '@/src/models/Candidate';



export async function POST(req: Request) {
  try {
    const { vacancy, manager, date, comment, candidateId } = await req.json();

    if (!vacancy || !manager) {
      return NextResponse.json(
        { message: 'Vacancy and Manager are required fields.' },
        { status: 400 }
      );
    }

    await connectDB();

    const newInterview = new Interview({
      vacancy,
      manager,
      date: date || Date.now(),  
      comment,
      candidate: candidateId
    });

    await newInterview.save();

    const candidate = await Candidate.findById(candidateId);

    if (!candidate) {
      return NextResponse.json(
        { message: 'Candidate not found.' },
        { status: 404 }
      );
    }

    candidate.interviews.push(newInterview._id);

    await candidate.save();


    return NextResponse.json(
      { message: 'Interview created successfully', interview: newInterview },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating interview:', error);

    return NextResponse.json(
      { message: 'Error creating interview', error: error.message },
      { status: 500 }
    );
  }
}
