import { NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/db';
import  Manager  from '@/src/models/Manager';

export const GET = async () => {
  try {
    await connectDB();

    const managers = await Manager.find({})
      .sort({ createdAt: -1 });


    const response = {
      managers,
      totalCount: managers.length,
    };

    return new NextResponse(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error("Error in fetching:", error);
    return new NextResponse("Error in fetching: " + error, { status: 500 });
  }
};
