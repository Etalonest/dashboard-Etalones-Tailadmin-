import { connectDB } from "@/src/lib/db";
import Vacancies from "@/src/models/Vacancies";

export const GET = async (request: Request) => {
 await connectDB();
  const vacancies = await Vacancies.find({})
    .sort({ title: 1 })
    .populate({
      path: "partner",
      select: "companyName",
    })
    .populate({
      path: "manager",
      select: "name phone",
    })
    

  return new Response(JSON.stringify(vacancies), { status: 200 });
};