import { connectDB } from "@/src/lib/db";
import Candidate from "@/src/models/Candidate";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
    try {
      await connectDB();
  
      const { searchParams } = new URL(request.url);
      const name = searchParams.get('name');
      const phone = searchParams.get('phone');
      const profession = searchParams.get('profession');
      const status = searchParams.get('status');
      const document = searchParams.get('document');
      const manager = searchParams.get('manager');
      const partner = searchParams.get('partner');
      const location = searchParams.get('location');
  
      const filter: any = {};
  
      if (name) filter.name = { $regex: name, $options: 'i' };
      if (phone) filter.phone = phone;
      if (profession) filter.professions = { $elemMatch: { name: { $regex: profession, $options: 'i' } } };
      if (status) filter.status = status;
      if (document) filter.documents = { $elemMatch: { name: { $regex: document, $options: 'i' } } };
      if (manager) filter.manager = manager;
      if (partner) filter.partner = partner;
      if (location) filter.location = { $regex: location, $options: 'i' };
  
      const candidates = await Candidate.find(filter);
  
      return new NextResponse(JSON.stringify({ candidates }), { status: 200 });
  
    } catch (error) {
      console.error('Error in fetching:', error);
      return new NextResponse('Error in fetching: ' + error, { status: 500 });
    }
  };
  