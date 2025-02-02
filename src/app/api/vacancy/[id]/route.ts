import { connectDB } from "@/src/lib/db";
import VacancyOnServer from "@/src/models/VacancyOnServer";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    await connectDB();
  
    const partner = await VacancyOnServer.findById(id)
      .populate(["image", "homeImages"])
      .lean() as any | null;
    if (!partner) {
      return NextResponse.json({ message: "Candidate not found" }, { status: 404 });
    }
  
    return NextResponse.json({ partner }, { status: 200 });}