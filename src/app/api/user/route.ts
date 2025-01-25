import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import User from "@/src/models/User";
import bcrypt from "bcrypt";


export const GET = async (request: Request) => {
  try {
    await connectDB();
    const users = await User.find({}).populate("role");
    return new NextResponse(JSON.stringify(users), { status: 200 });
  }
  catch (error) {
    console.error("Ошибка при получении данных пользователя:", error);
    return new NextResponse(
      JSON.stringify({ message: "Ошибка при получении данных пользователя" }),
      { status: 500 }
    );
  }
}

export const POST = async (request: Request) => {
  try {
    // Получаем данные из формы (с помощью request.formData())
    const formData = await request.formData();
    const name = formData.get('name')?.toString();
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();
    const role = '677246ef59f26ec91782f449';

    if (!name || !email || !password) {
      return new NextResponse(
        JSON.stringify({ message: "Все поля обязательны для заполнения" }),
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new NextResponse(
        JSON.stringify({ message: "Пользователь с таким email уже существует" }),
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await connectDB();

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();

    return new NextResponse(
      JSON.stringify({ message: "Пользователь успешно создан" }),
      { status: 201 }
    );
  } catch (error: any) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "Ошибка при создании пользователя", error: error.message }),
      { status: 500 }
    );
  }
};
