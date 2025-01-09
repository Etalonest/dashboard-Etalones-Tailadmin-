import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import User from "@/src/models/User";
import bcrypt from "bcrypt";

export const POST = async (request: Request) => {
  try {
    // Получаем данные из формы (с помощью request.formData())
    const formData = await request.formData();
    const name = formData.get('name')?.toString();
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();

    if (!name || !email || !password) {
      return new NextResponse(
        JSON.stringify({ message: "Все поля обязательны для заполнения" }),
        { status: 400 }
      );
    }

    // Проверяем, существует ли уже пользователь с таким email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new NextResponse(
        JSON.stringify({ message: "Пользователь с таким email уже существует" }),
        { status: 400 }
      );
    }

    // Хэшируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Подключаемся к базе данных
    await connectDB();

    // Создаем нового пользователя
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
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
