import { connectDB } from '@/src/lib/db';
import Manager from '@/src/models/Manager';
import { se } from 'date-fns/locale';
import { create } from 'domain';
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (request: NextRequest, { params }: any) => {
  try {
      // Логируем начало выполнения запроса
      // console.log("Запрос PUT для обновления менеджера");

      // Подключаемся к базе данных
      await connectDB();

      const id = params.id;
      // console.log("ID менеджера для обновления:", id);  // Логируем id

      const data = await request.formData();
      const file = data.get('file');  // Получаем файл из formData

      // Проверяем, что file действительно является объектом типа File
      if (file && file instanceof File) {
          const { name, phone, email, viber, telegram, whatsapp } = Object.fromEntries(data);

          // Преобразуем файл в буфер данных
          const bufferData = await file.arrayBuffer();
          const buffer = Buffer.from(bufferData);

          const updatedManager = {
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

          // Лог перед выполнением поиска
          // console.log("Обновляем данные менеджера с ID:", id);
          const updatedManagerDoc = await Manager.findByIdAndUpdate(id, updatedManager, { new: true });

          if (!updatedManagerDoc) {
              // console.log("Менеджер с ID", id, "не найден.");
              return new NextResponse(JSON.stringify({ success: false, message: "Manager not found" }), { status: 404 });
          }

          // Лог успешного обновления
          // console.log("Менеджер обновлен:", updatedManagerDoc);
          return new NextResponse(JSON.stringify({ success: true, message: "Manager updated", manager: updatedManagerDoc }), { status: 200 });
      } else {
          // Если файл не выбран, обновляем без изображения
          const { name, phone, email, viber, telegram, whatsapp } = Object.fromEntries(data);

          const updatedManager = {
              name,
              phone,
              email,
              viber,
              telegram,
              whatsapp
          };

          // Лог перед выполнением поиска
          // console.log("Обновляем данные менеджера с ID:", id);
          const updatedManagerDoc = await Manager.findByIdAndUpdate(id, updatedManager, { new: true });

          if (!updatedManagerDoc) {
              console.log("Менеджер с ID", id, "не найден.");
              return new NextResponse(JSON.stringify({ success: false, message: "Manager not found" }), { status: 404 });
          }

          // Лог успешного обновления
          // console.log("Менеджер обновлен:", updatedManagerDoc);
          return new NextResponse(JSON.stringify({ success: true, message: "Manager updated", manager: updatedManagerDoc }), { status: 200 });
      }
  } catch (error) {
      // Логируем ошибку
      console.error("Ошибка при обновлении менеджера:", error);
      return new NextResponse(JSON.stringify({ success: false, message: "Error updating manager", error }), { status: 500 });
  }
};


export async function GET(request: Request, { params }: any) {
  const { id } = params;
  console.log("Запрос GET для получения менеджера с ID:", id);

  try {
    // Подключение к базе данных
    await connectDB();
    console.log("Подключение к базе данных успешно выполнено.");

    // Запрос для получения менеджера с использованием populate
    const manager = await Manager.findById(id)
      .populate('events')
      .populate({
        path: 'candidates',
        options: { sort: { updatedAt: -1 } },
        populate: [
          {
            path: 'events',
            select: ['eventType', 'description', 'comment', 'createdAt', 'manager', 'vacancy'],
          },
          {
            path: 'documents',
            populate: {
              path: 'file',
              select: 'name contentType',
            },
          },
          {
            path: 'dialogs',
            select: 'text date author',
          }
        ]
      })
      .populate({
        path: 'candidateFromInterview',
        options: { sort: { updatedAt: -1 } },
        populate: [
          {
            path: 'recruiter',
            select: 'name'
          },
          {
            path: 'manager',
            select: 'name'
          },
          {
            path: 'events',
            select: ['eventType', 'description', 'comment', 'createdAt', 'manager', 'vacancy'],
            populate: [
              {
                path: 'manager',
                select: 'name'
              },
              {
                path: 'vacancy',
                select: ''
              }
            ]
          }
        ],
      })
      .populate('role')
      .populate({
        path: 'partners',
        options: { sort: { updatedAt: -1 } },
        populate: [
          {
            path: 'manager',
            select: 'name phone'
          },
          {
            path: 'documents',
            populate: {
              path: 'file',
              select: 'name contentType',
            },
          },
          {
            path: 'professions',
            populate: {
              path: 'vacancy',
              select: '',
            }
          }
        ]
      })
      .populate({
        path: 'partnersStage',
        populate: [
          {
            path: 'all',
            model: 'Partner',
            populate: [
              {
                path: 'manager',
                select: 'name phone'
              },
              {
                path: 'documents',
                populate: {
                  path: 'file',
                  select: 'name contentType',
                },
              },
              {
                path: 'professions',
                populate: {
                  path: 'vacancy',
                  select: '',
                }
              }
            ]
          },
          {
            path: 'peopleOnObj',
            model: 'Partner',
            select: ''
          },
          {
            path: 'checkPeople',
            model: 'Partner',
            select: ''
          },
          {
            path: 'oneCall',
            model: 'Partner',
            select: ''
          },
          {
            path: 'waitContract',
            model: 'Partner',
            select: ''
          }
        ]
      })
      .lean();

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

// export async function GET(request: Request, { params }: any) {
//   const { id } = params;
//   console.log("Запрос GET для получения менеджера с ID:", request.url);

//   try {
//       await connectDB();
//       console.log("Подключение к базе данных успешно выполнено.");

//       const manager = await Manager.findById(id)
//       .populate('events')
//       .populate({
//         path: 'candidates',
//         options: { sort: { updatedAt: -1 } },
//         populate: [
//           {
//             path: 'events',
//             select: ['eventType','description','comment', 'createdAt','manager', 'vacancy'],
//           },
//           {
//             path: 'documents',
//             populate: {
//               path: 'file',
//               select: 'name contentType',
//             },
//           },
//           {
//             path: 'dialogs',
//             select: 'text date author',
//           }
//         ]
//       })
//       .populate({
//         path:'candidateFromInterview',
//         options: { sort: { updatedAt: -1 } },
//         populate: [
//           {
//             path:'recruiter',
//             select: 'name'
//           },
//           {
//             path:'manager',
//             select: 'name'
//           },
//           {
//             path:'events',
//             select: ['eventType','description','comment', 'createdAt','manager', 'vacancy'],
//             populate: [{
//               path: 'manager',
//               select: 'name'   
//             },
//             {
//               path: 'vacancy',
//               select: ''
//             }
//             ]
//           }
//         ],
//       })
//       .populate('role')
//       .populate({
//         path: 'partners',
//         options: { sort: { updatedAt: -1 } },
//         populate: [
//           {
//             path: 'manager',
//             select: 'name phone '
//           },
//           {
//             path: 'documents',
//             populate: {
//               path: 'file',
//               select: 'name contentType',
//             },
//           },
//           {
//             path: 'professions',
//             populate: {
//               path: 'vacancy',
//               select: '',
//               }
//           }
//         ]
//       })
//       .populate({
//         path: 'partnersStage',
//         options: { sort: { updatedAt: -1 } },
//         populate: [
//           {
//             path: 'peopleOnObj', // В поле peopleOnObj будут ObjectId партнёров, если они есть
//             populate: {
//               path: 'manager', // Если partner имеет поле manager
//               select: 'name phone'
//             }
//           },
//           {
//             path: 'documents',
//             populate: {
//               path: 'file',
//               select: 'name contentType',
//             },
//           },
//           {
//             path: 'professions',
//             populate: {
//               path: 'vacancy',
//               select: '',
//             }
//           }
//         ]
//       });
      
//       console.log('Количество кандидатов:', manager?.candidates?.length); 
//       if (!manager) {

//           console.log("Менеджер с ID", id, "не найден.");
//           return NextResponse.json({ error: "Manager not found" }, { status: 404 });
//       }

//       return NextResponse.json({ manager }, { status: 200 });


//   } catch (error) {
//       console.error("Ошибка при получении данных менеджера:", error);
//       return NextResponse.json({ error: "Failed to fetch manager data" }, { status: 500 });
//   }
// }
