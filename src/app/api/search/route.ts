
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import Candidate from "@/src/models/Candidate";
import Partner from "@/src/models/Partner"; // Импортируем модель партнёра

export const GET = async (request: NextRequest) => {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query) {
      return new NextResponse(JSON.stringify({ candidates: [], partners: [] }), { status: 200 });
    }

    // Поиск среди кандидатов
    const candidates = await Candidate.find({
      private: false,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } },
      ]
    }).populate(['manager', 'stages']);

    // Поиск среди партнёров
    const partners = await Partner.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } },
      ]
    }).populate(['manager']); // Если у партнёров есть такие же связи, как у кандидатов

    // Объединяем результаты кандидатов и партнёров
    const results = [...candidates, ...partners];

    return new NextResponse(JSON.stringify({ results }), { status: 200 });

  } catch (error) {
    console.error("Error in fetching:", error);
    return new NextResponse("Error in fetching: " + error, { status: 500 });
  }
};
