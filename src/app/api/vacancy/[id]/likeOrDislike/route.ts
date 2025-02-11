import { connectDB } from '@/src/lib/db';
import Vacancies  from '@/src/models/Vacancies';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
        await connectDB();
        
        const vacancyId = params.id; 
        console.log("vacancyId", vacancyId);
        const data = await request.json(); // Получаем данные из тела запроса
        const { userId, action } = data; // Извлекаем userId и действие (like или dislike)

        console.log("USERID", userId); // Логируем ID пользователя

        // Находим отзыв по ID
        const vacancy = await Vacancies.findById(vacancyId);
        if (!vacancy) {
            return new NextResponse(JSON.stringify({ success: false, message: "Vacancy not found" }), { status: 404 });
        }

        if (action === 'like') {
            // Логика для лайков
            const userIndex = vacancy.likes.indexOf(userId);
            if (userIndex === -1) {
                // Если лайка нет, добавляем userId в массив лайков
                vacancy.likes.push(userId);
            } else {
                // Если лайк уже есть, удаляем userId из массива лайков
                vacancy.likes.splice(userIndex, 1);
            }
        } else if (action === 'dislike') {
            // Логика для дизлайков
            const userIndex = vacancy.dislikes.indexOf(userId);
            if (userIndex === -1) {
                // Если дизлайка нет, добавляем userId в массив дизлайков
                vacancy.dislikes.push(userId);
            } else {
                // Если дизлайк уже есть, удаляем userId из массива дизлайков
                vacancy.dislikes.splice(userIndex, 1);
            }
        } else {
            return new NextResponse(JSON.stringify({ success: false, message: "Invalid action" }), { status: 400 });
        }

        await vacancy.save();
        const likesCount = vacancy.likes.length;
        const dislikesCount = vacancy.dislikes.length;

        return new NextResponse(JSON.stringify({ success: true, message: "Vacancy updated", likesCount, dislikesCount }), { status: 200 });

    } catch (error) {
        console.error("Error details:", error); // Логируем ошибку для отладки
        return new NextResponse(JSON.stringify({ success: false, message: "Error updating review", error }), { status: 500 });
    }
};
