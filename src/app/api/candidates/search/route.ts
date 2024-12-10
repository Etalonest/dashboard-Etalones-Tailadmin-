import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/app/lib/utils';
import { Candidate } from '@/app/lib/models';

export const POST = async (request: NextRequest) => {
  try {
    await connectToDB();

    const { page = 1, limit = 5, searchTerm = '',phone = '', profession = '', document = '' } = await request.json();

    const offset = (page - 1) * limit;

    const searchQuery: any = { $and: [] };

    if (searchTerm) {
      searchQuery.$and.push({ name: { $regex: searchTerm, $options: 'i' } });
    }
    if (profession) {
      searchQuery.$and.push({ 'professions.name': { $regex: profession, $options: 'i' } });
    }
    if (phone) {
        searchQuery.$and.push({ phone: { $regex: phone, $options: 'i' } });
      }
    if (document) {
      searchQuery.$and.push({ 'documents.docType': { $regex: document, $options: 'i' } });
    }

    if (searchQuery.$and.length === 0) {
      delete searchQuery.$and;
    }

    const candidates = await Candidate.find(searchQuery)
      .sort({"updatedAt" : -1})
      .skip(offset)
      .limit(limit)
      .populate(['manager','tasks']);

    const totalCandidates = await Candidate.countDocuments(searchQuery);
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
    return new NextResponse(`Error in fetching: ${error}`, { status: 500 });
  }
};
