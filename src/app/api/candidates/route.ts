import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/app/lib/utils';
import { Candidate } from '@/app/lib/models';

export const GET = async (request: NextRequest) => {
  try {
    await connectToDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '5', 10);

    const offset = (page - 1) * limit;

    const candidates = await Candidate.find({})
      .sort({ 'createdAt': -1 })
      .skip(offset)
      .limit(limit)
      .populate(['manager','tasks']); 

    const totalCandidates = await Candidate.countDocuments({});
    const totalPages = Math.ceil(totalCandidates / limit);

    const response = {
      candidates,
      page,
      totalPages, // Убедитесь, что это поле присутствует
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
