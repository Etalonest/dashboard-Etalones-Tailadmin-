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

export const POST = async (request: Request) => {
  try {
    await connectDB();

    const { email, name, phone, image, role } = await request.json();
    const manager = await Manager.create({
      email,
      name,
      phone,
      image,
      role,
    });

    return new NextResponse(JSON.stringify(manager), { status: 201 });
  } catch (error) {
    console.error("Error in creating manager:", error);
    return new NextResponse("Error in creating manager: " + error, { status: 500 });
  }
};

export const PUT = async (request: Request) => {
  try {
    await connectDB();

    const { id, email, name, phone, image, role } = await request.json();
    const manager = await Manager.findByIdAndUpdate(id, {
      email,
      name,
      phone,
      image,
      role,
    });

    return new NextResponse(JSON.stringify(manager), { status: 200 });
  } catch (error) {
    console.error("Error in updating manager:", error);
    return new NextResponse("Error in updating manager: " + error, { status: 500 });
  }
};

export const DELETE = async (request: Request) => {
  try {
    await connectDB();

    const { id } = await request.json();
    const manager = await Manager.findByIdAndDelete(id);

    return new NextResponse(JSON.stringify(manager), { status: 200 });
  } catch (error) {
    console.error("Error in deleting manager:", error);
    return new NextResponse("Error in deleting manager: " + error, { status: 500 });
  }
};  