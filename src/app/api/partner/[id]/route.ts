import { connectDB } from '@/src/lib/db';
import  Candidate  from '@/src/models/Candidate';
import Partner from '@/src/models/Partner';
import { CommentEntry } from '@/src/components/forms/interfaces/FormCandidate.interface';
import { NextResponse } from 'next/server';

interface CandidateDoc {
  manager?: any;
  ageNum?: string;
  citizenship?: string;
  locations?: string;
  phone?: string;
  name?: string;
  _id?: string;
  partners?: string;
  comment?: CommentEntry[];
  documents?: {
    docType?: any;
    dateExp?: any;
    dateOfIssue?: any;
    numberDoc?: any; 
    file?: string 
}[];
}
export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    await connectDB();
  
    const candidate = await Partner.findById(id)
      .populate(['comment', 'manager', 'professions', 'tasks', 'documents','dialogs']) 
      .lean() as CandidateDoc | null;
    if (!candidate) {
      return NextResponse.json({ message: "Candidate not found" }, { status: 404 });
    }
  
    return NextResponse.json({ candidate }, { status: 200 });}