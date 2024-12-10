import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import  Profession  from "@/src/models/Profession";

export const GET = async() =>{
    try{
await connectDB()
const profession = await Profession.find().sort({ name: 1 })
return new NextResponse(JSON.stringify(profession), {status:200})

    }
    catch(error){
return new NextResponse("error in fetch professions" + error, {status:500})
    }
}