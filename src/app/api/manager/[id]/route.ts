// import { connectDB } from '@/src/lib/db';
// import Manager  from '@/src/models/Manager';
// import { NextResponse } from "next/server";

// export const PUT = async (request: { formData: () => any; }, { params }: any) => {
//     try {
//         await connectDB();
//         const id = params.id;

//         const data = await request.formData();
//         const file = data.get('file'); // Если файл загружается, получаем его здесь
//         const { name, phone, email, viber, telegram, whatsapp } = Object.fromEntries(data); // Получаем данные из формы

//         let updatedManager;

//         if (file) {
//             // Если выбран файл, обновляем и изображение
//             const bufferData = await file.arrayBuffer();
//             const buffer = Buffer.from(bufferData);

//             updatedManager = {
//                 name,
//                 phone,
//                 email,
//                 viber,
//                 telegram,
//                 whatsapp,
//                 image: {
//                     name: file.name,
//                     data: buffer,
//                     contentType: file.type
//                 }
//             };
//         } else {
//             // Если файл не выбран, обновляем без изображения
//             updatedManager = {
//                 name,
//                 phone,
//                 email,
//                 viber,
//                 telegram,
//                 whatsapp
//             };
//         }

//         const updatedManagerDoc = await Manager.findByIdAndUpdate(id, updatedManager, { new: true });

//         if (!updatedManagerDoc) {
//             return new NextResponse(JSON.stringify({ success: false, message: "Manager not found" }), { status: 404 });
//         }

//         return new NextResponse(JSON.stringify({ success: true, message: "Manager updated", manager: updatedManagerDoc }), { status: 200 });

//     } catch (error) {
//         console.error("Error updating manager:", error);
//         return new NextResponse(JSON.stringify({ success: false, message: "Error updating manager", error }), { status: 500 });
//     }
// };


// export async function GET(request: any, { params }: any) {
//     const { id } = params; // Получаем параметр id из URL

//     await connectDB();

//     try {

//         const manager = await Manager.findById(id)
//         .populate({
//           path: 'candidates',
//           options: { sort: { updatedAt: -1 } } // сортировка по убыванию даты создания
//         })
//         .populate('role')
//         .populate('partners');
              
// console.log(manager.role.name);
//         if (!manager) {
//             return NextResponse.json({ error: "Manager not found" }, { status: 404 });
//         }

//         // Если менеджер найден
//         return NextResponse.json({ manager }, { status: 200 });

//     } catch (error) {
//         // Логируем ошибку
//         console.error("Error fetching manager data:", error);
//         return NextResponse.json({ error: "Failed to fetch manager data" }, { status: 500 });
//     }
// }

import { connectDB } from '@/src/lib/db';
import Candidate from '@/src/models/Candidate';
import Manager from '@/src/models/Manager';
import { NextResponse } from "next/server";

export const PUT = async (request: { formData: () => any; }, { params }: any) => {
    try {
        // Логируем начало выполнения запроса
        console.log("Запрос PUT для обновления менеджера");

        // Подключаемся к базе данных
        await connectDB();

        const id = params.id;
        console.log("ID менеджера для обновления:", id);  // Логируем id

        const data = await request.formData();
        const file = data.get('file'); // Если файл загружается, получаем его здесь
        const { name, phone, email, viber, telegram, whatsapp } = Object.fromEntries(data); // Получаем данные из формы

        let updatedManager;

        if (file) {
            // Если выбран файл, обновляем и изображение
            const bufferData = await file.arrayBuffer();
            const buffer = Buffer.from(bufferData);

            updatedManager = {
                name,
                phone,
                email,
                viber,
                telegram,
                whatsapp,
                image: {
                    name: file.name,
                    data: buffer,
                    contentType: file.type
                }
            };
        } else {
            // Если файл не выбран, обновляем без изображения
            updatedManager = {
                name,
                phone,
                email,
                viber,
                telegram,
                whatsapp
            };
        }

        // Лог перед выполнением поиска
        console.log("Обновляем данные менеджера с ID:", id);
        const updatedManagerDoc = await Manager.findByIdAndUpdate(id, updatedManager, { new: true });

        if (!updatedManagerDoc) {
            console.log("Менеджер с ID", id, "не найден.");
            return new NextResponse(JSON.stringify({ success: false, message: "Manager not found" }), { status: 404 });
        }

        // Лог успешного обновления
        console.log("Менеджер обновлен:", updatedManagerDoc);
        return new NextResponse(JSON.stringify({ success: true, message: "Manager updated", manager: updatedManagerDoc }), { status: 200 });

    } catch (error) {
        // Логируем ошибку
        console.error("Ошибка при обновлении менеджера:", error);
        return new NextResponse(JSON.stringify({ success: false, message: "Error updating manager", error }), { status: 500 });
    }
};

export async function GET(request: any, { params }: any) {
  const { id } = params;
  console.log("Запрос GET для получения менеджера с ID:", id);

  try {
      await connectDB();
      console.log("Подключение к базе данных успешно выполнено.");

      const manager = await Manager.findById(id)
      .populate({
        path: 'candidates',
        options: { sort: { updatedAt: -1 } },
        populate: [
          {
            path: 'documents',
            populate: {
              path: 'file',
              select: 'name data contentType',
            },
          },
          {
            path: 'dialogs',
            select: 'text date author',
          }
        ]
      })
      .populate('role')
      .populate({
        path: 'partners',
        options: { sort: { updatedAt: -1 } },
        populate: [
          {
            path: 'documents',
            populate: {
              path: 'file',
              select: 'name data contentType',
            },
          },
        ]
      });
    
      if (!manager) {

          console.log("Менеджер с ID", id, "не найден.");
          return NextResponse.json({ error: "Manager not found" }, { status: 404 });
      }

      return NextResponse.json({ manager }, { status: 200 });


  } catch (error) {
      console.error("Ошибка при получении данных менеджера:", error);
      return NextResponse.json({ error: "Failed to fetch manager data" }, { status: 500 });
  }
}
