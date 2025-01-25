import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import  Role  from "@/src/models/Role";

export const GET = async() =>{
    try{
await connectDB()
const roles = await Role.find().sort({ name: 1 })
return new NextResponse(JSON.stringify(roles), {status:200})

    }
    catch(error){
return new NextResponse("error in fetch professions" + error, {status:500})
    }
}