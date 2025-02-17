import { connectDB } from "@/src/lib/db";
import Candidate from "@/src/models/Candidate";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    await connectDB();

    // Получаем только кандидатов, у которых private: false
    const candidates = await Candidate.find({ private: false })
      .sort({ 'updatedAt': -1 })
      .populate(['manager', 'stages']); // без пагинации

    const totalCandidates = candidates.length;

    const response = {
      candidates,
      totalCandidates
    };

    return new NextResponse(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error("Error in fetching:", error);
    return new NextResponse("Error in fetching: " + error, { status: 500 });
  }
};
