// import { connectDB } from '@/src/lib/db'; // Подключаемся к базе данных
// import Manager from '@/src/models/Manager'; // Импортируем модель менеджера
// import Candidate from '@/src/models/Candidate'; // Импортируем модель кандидата
// import { NextResponse } from 'next/server';

// export async function GET(request: Request, { params }: { params: { id: string } }) {
//     const { id } = params;
//     console.log("PARAMS", params);
//     try {
//         await connectDB();

//         // Шаг 1: Получаем менеджера по id и его кандидатов
//         const manager = await Manager.findById(id).select('candidatesFromRecruiter');
//         if (!manager) {
//             return NextResponse.json({ message: 'Менеджер не найден' }, { status: 404 });
//         }

//         const candidates = await Candidate.find({
//             '_id': { $in: manager.candidatesFromRecruiter }
//         }).sort({ 'updatedAt': -1 })
//         .populate({
//             path: 'documents',
//             options: { sort: { updatedAt: -1 } },
//             populate: [
//                 {
//                     path: 'file',
//                     select: 'name contentType',
//                 }
//             ]
//         })
//         .populate({
//             path: 'recruiter',
//             select: 'name',
//         })
//         .populate({
//             path: 'stages',
//             select: ['comment','tasks','vacancy'],
//             populate: [
//                 {
//                     path: 'vacancy',
//                     select: ['title', 'location', 'roof_type', 'partner'],
//                     populate: {
//                         path: 'partner',
//                         select: ['name', 'companyName'],
//                     }
//                 },
//                 {
//                     path: 'tasks',  
//                     select: ['taskName', 'dueDate', 'status','vacancy']  
//                 }
//             ]
//         });
        
           
     

//         if (!candidates || candidates.length === 0) {
//             return NextResponse.json({ message: 'Кандидаты не найдены' }, { status: 404 });
//         }

//         return NextResponse.json({ candidates }, { status: 200 });
//     } catch (error: any) {
//         console.error('Ошибка при получении кандидатов:', error);
//         return NextResponse.json({ message: 'Ошибка при получении кандидатов', error: error.message }, { status: 500 });
//     }
// }
import { connectDB } from '@/src/lib/db'; // Подключаемся к базе данных
import Manager from '@/src/models/Manager'; // Импортируем модель менеджера
import Candidate from '@/src/models/Candidate'; // Импортируем модель кандидата
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    console.log("PARAMS", params);
    try {
        await connectDB();

        // Шаг 1: Получаем менеджера по id и его кандидатов
        const manager = await Manager.findById(id).select('candidatesFromRecruiter');
        if (!manager) {
            return NextResponse.json({ message: 'Менеджер не найден' }, { status: 404 });
        }

        const candidates = await Candidate.find({
            '_id': { $in: manager.candidatesFromRecruiter }
        }).sort({ 'updatedAt': -1 })
        .populate({
            path: 'documents',
            options: { sort: { updatedAt: -1 } },
            populate: [
                {
                    path: 'file',
                    select: 'name contentType',
                }
            ]
        })
        .populate({
            path: 'recruiter',
            select: 'name',
        })
        .populate({
            path: 'stages',
            select: ['comment','tasks','vacancy'],
            populate: [
                {
                    path: 'vacancy',
                    select: ['title', 'location', 'roof_type', 'partner'],
                    populate: {
                        path: 'partner',
                        select: ['name', 'companyName'],
                    }
                },
                {
                    path: 'tasks',  
                    select: ['taskName', 'dueDate', 'status','vacancy']  
                }
            ]
        });

        // Если кандидатов нет, возвращаем статус 200 с сообщением
        if (!candidates || candidates.length === 0) {
            return NextResponse.json({ message: 'Кандидаты не найдены' }, { status: 200 });
        }

        return NextResponse.json({ candidates }, { status: 200 });
    } catch (error: any) {
        console.error('Ошибка при получении кандидатов:', error);
        return NextResponse.json({ message: 'Ошибка при получении кандидатов', error: error.message }, { status: 500 });
    }
}
