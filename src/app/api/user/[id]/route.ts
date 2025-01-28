import { connectDB } from "@/src/lib/db";
import  User  from "@/src/models/User";
import { NextResponse } from "next/server";

export const GET = async (request: any, { params }: any) => {
    const { id } = params;
    await connectDB();
    
    try {
      const user = await User.findById(id);
      if (!user) {
        return new NextResponse(
          JSON.stringify({ message: "User not found" }),
          { status: 404 }
        );
      }

      return new NextResponse(
        JSON.stringify({ user }),
        { status: 200 }
      );
    } catch (error) {
      console.error("Error fetching user:", error);
      return new NextResponse(
        JSON.stringify({ message: "Internal server error" }),
        { status: 500 }
      );
    }
  };


  export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
  
    try {
      // Получаем данные из formData
      const formData = await request.formData();
      const role = formData.get('role');  // Извлекаем роль из данных
  
      // Если роль не была передана, возвращаем ошибку
      if (!role) {
        return NextResponse.json({ message: "Role is required" }, { status: 400 });
      }
  
      await connectDB();
  
      // Находим пользователя по id
      const oldUser = await User.findById(id).lean();
  
      if (!oldUser) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }
  
      // Обновляем роль пользователя
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: { role: role } },  // Обновляем роль
        { new: true }  // Возвращаем обновленный объект
      ).lean();
  
      if (!updatedUser) {
        return NextResponse.json({ message: "Error updating user" }, { status: 500 });
      }
  
      // Возвращаем успешный ответ
      return NextResponse.json({ message: "User role updated successfully", updatedUser }, { status: 200 });
    } catch (error: any) {
      console.error('Error processing the request:', error);
      return NextResponse.json({ message: 'Error processing request', error: error.message }, { status: 500 });
    }
  }
  