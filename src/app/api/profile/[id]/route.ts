import { connectDB } from '@/src/lib/db';
import Manager from '@/src/models/Manager';
import { NextResponse } from 'next/server';

// POST запрос для создания менеджера
export const POST = async (request: any, { params }: any) => {
    try {
        await connectDB();
        
        const data = await request.formData();
        const file = data.get('profileImage'); // Файл изображения
        const name = data.get('name');
        const phone = data.get('phone');
        
        let image = null;

        if (file) {
            // Если есть изображение, преобразуем его в буфер
            const bufferData = await file.arrayBuffer();
            const buffer = Buffer.from(bufferData);

            image = {
                name: file.name,
                data: buffer,
                contentType: file.type,
            };
        }

        // Создание нового менеджера
        const newManager = new Manager({
            name,
            phone,
            image,
        });

        await newManager.save();

        return new NextResponse(
            JSON.stringify({ success: true, message: 'Manager created successfully', manager: newManager }),
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating manager:', error);
        return new NextResponse(
            JSON.stringify({ success: false, message: 'Error creating manager', error }),
            { status: 500 }
        );
    }
};

export const GET = async (request: any, { params }: any) => {
    const { id } = params;
    await connectDB();
    
    try {
        const manager = await Manager.findById(id);

        if (!manager) {
            return new NextResponse(
                JSON.stringify({ message: 'Manager not found' }),
                { status: 404 }
            );
        }

        return new NextResponse(
            JSON.stringify({ manager }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching manager:', error);
        return new NextResponse(
            JSON.stringify({ message: 'Internal server error' }),
            { status: 500 }
        );
    }
};

export const PUT = async (request: any, { params }: any) => {
    try {
        await connectDB();
        const id = params.id; 
        
        const data = await request.formData();
        console.log("DataOnServer",data);
        const file = data.get('file');  // Новый файл изображения (если есть)
        const name = data.get('name');          // Обновленное имя
        const phone = data.get('phone');        // Обновленный телефон

        // Проверка на обязательность телефона
        if (phone && phone === 'null') {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Phone number is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Получаем текущие данные менеджера из базы
        const existingManager = await Manager.findById(id);

        if (!existingManager) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Manager not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Формируем обновленные данные. Обновляем только измененные поля.
        let updatedManager: any = {};

        if (name) {
            updatedManager.name = name;  // Обновляем имя, если оно передано
        }

        if (phone) {
            updatedManager.phone = phone; // Обновляем телефон, если оно передано
        }

        // Если новое изображение было передано, обновляем его
        if (file) {
            const bufferData = await file.arrayBuffer();
            const buffer = Buffer.from(bufferData);

            updatedManager.image = {
                name: file.name,
                data: buffer,
                contentType: file.type,
            };
        } else {
            // Если файла нет, оставляем текущее изображение
            updatedManager.image = existingManager.image;
        }

        // Если нет изменений, возвращаем ошибку
        if (Object.keys(updatedManager).length === 0) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'No changes to update' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const manager = await Manager.findByIdAndUpdate(id, updatedManager, { new: true });

        return new NextResponse(
            JSON.stringify({ success: true, message: 'Manager updated', manager }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error updating manager:', error);
        return new NextResponse(
            JSON.stringify({ success: false, message: 'Error updating manager', error }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};