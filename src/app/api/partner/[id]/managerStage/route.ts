import { connectDB } from '@/src/lib/db'; 
import Manager from '@/src/models/Manager';



export const POST = async (req: Request, { params }: any) => {
    const { id } = params; // Получаем ID партнёра из URL

    try {
        // Получаем данные из формы
        const formData = await req.formData();
        const status = formData.get('status') as string;
        const responsible = formData.get('responsible') as string;

        console.log("STATUS", status);
        console.log("RESPONSIBLE", responsible);

        // Подключаемся к базе данных
        await connectDB();

        // Ищем менеджера по ID
        const manager = await Manager.findById(responsible);
        if (!manager) {
            return new Response(JSON.stringify({ error: 'Менеджер не найден' }), { status: 404 });
        }

        

        // Возвращаем успешный ответ
        return new Response(JSON.stringify({ message: 'Статус обновлён, партнёр перемещён в новую стадию' }), { status: 200 });

    } catch (error) {
        console.error("Ошибка при обновлении статуса партнёра:", error);
        return new Response(JSON.stringify({ error: 'Ошибка при обновлении статуса партнёра' }), { status: 500 });
    }
};
