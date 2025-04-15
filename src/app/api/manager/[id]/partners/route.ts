// import { NextRequest, NextResponse } from 'next/server';
// import { connectDB } from '@/src/lib/db';
// import Manager from '@/src/models/Manager';

// export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
//   await connectDB();

//   try {
//     // Печатаем полученные данные запроса
//     const requestData = await req.json();
//     console.log('Получены данные запроса:', requestData);

//     const { partnerId, stage, checked } = requestData;

//     // Проверка на наличие необходимых данных
//     if (!partnerId || !stage || checked === undefined) {
//       console.log('Ошибка: Необходимо передать partnerId, stage и checked');
//       return NextResponse.json({ error: 'Необходимо передать partnerId, stage и checked' }, { status: 400 });
//     }

//     const managerId = params.id;
//     console.log('ID менеджера:', managerId);

//     // Ищем менеджера в базе данных
//     const manager = await Manager.findById(managerId);
//     if (!manager) {
//       console.log(`Ошибка: Менеджер с id ${managerId} не найден`);
//       return NextResponse.json({ error: 'Менеджер не найден' }, { status: 404 });
//     }

//     console.log('Менеджер найден:', manager);

//     // Находим нужную стадию
//     const stageObj = manager.partnersStage.find((obj: any) => {
//       const keys = Object.keys(obj.toObject());
//       const hasStage = keys.includes(stage);
//       console.log('Проверка стадии:', keys, '->', hasStage ? 'НАЙДЕНА' : 'не найдена');
//       return hasStage;
//     });

//     if (!stageObj) {
//       console.log(`Ошибка: Стадия "${stage}" не найдена`);
//       return NextResponse.json({ error: `Стадия "${stage}" не найдена` }, { status: 400 });
//     }

//     console.log(`Стадия "${stage}" найдена.`, stageObj);

//     // Проверяем, является ли стадия массивом или объектом
//     let currentArray = stageObj[stage];

//     if (!Array.isArray(currentArray)) {
//       console.log(`Стадия "${stage}" не является массивом. Это объект.`);
//       // Если это объект, то можно извлечь массив из его полей
//       currentArray = currentArray ? Object.values(currentArray)[0] : [];
//       console.log('Используем извлечённый массив:', currentArray);
//     }

//     console.log('Текущие партнёры на стадии:', currentArray);

//     const ids = currentArray.map((id: any) => id.toString());

//     // Если `checked` true — добавляем партнёра
//     if (checked) {
//       if (!ids.includes(partnerId)) {
//         // Добавляем партнёра с помощью Mongoose и оператора $push
//         await Manager.updateOne(
//           { _id: managerId, "partnersStage.stage": stage },
//           { $push: { "partnersStage.$.partners": partnerId } }
//         );
//         console.log(`Партнёр ${partnerId} добавлен в стадию "${stage}"`);
//       } else {
//         console.log(`Партнёр ${partnerId} уже в стадии "${stage}"`);
//       }
//     } else {
//       // Если `checked` false — удаляем партнёра
//       await Manager.updateOne(
//         { _id: managerId, "partnersStage.stage": stage },
//         { $pull: { "partnersStage.$.partners": partnerId } }
//       );
//       console.log(`Партнёр ${partnerId} удалён из стадии "${stage}"`);
//     }

//     // Возвращаем успешный ответ
//     return NextResponse.json({ success: true });

//   } catch (error) {
//     console.error('Ошибка при обработке запроса:', error);
//     return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
//   }
// }
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/db';
import Manager from '@/src/models/Manager';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    // Печатаем полученные данные запроса
    const requestData = await req.json();
    console.log('Получены данные запроса:', requestData);

    const { partnerId, stage, checked } = requestData;

    // Проверка на наличие необходимых данных
    if (!partnerId || !stage || checked === undefined) {
      console.log('Ошибка: Необходимо передать partnerId, stage и checked');
      return NextResponse.json({ error: 'Необходимо передать partnerId, stage и checked' }, { status: 400 });
    }

    const managerId = params.id;
    console.log('ID менеджера:', managerId);

    // Ищем менеджера в базе данных
    const manager = await Manager.findById(managerId);
    if (!manager) {
      console.log(`Ошибка: Менеджер с id ${managerId} не найден`);
      return NextResponse.json({ error: 'Менеджер не найден' }, { status: 404 });
    }

    console.log('Менеджер найден:', manager);

    // Проверка на наличие поля partnersStage и его корректности
    if (!Array.isArray(manager.partnersStage)) {
      console.log('Ошибка: partnersStage должно быть массивом');
      return NextResponse.json({ error: 'partnersStage должно быть массивом' }, { status: 400 });
    }

    // Разворачиваем только выбранную стадию
    const stageObj = manager.partnersStage.find((obj: any) => obj.hasOwnProperty(stage));
    if (!stageObj) {
      console.log(`Ошибка: Стадия "${stage}" не найдена`);
      return NextResponse.json({ error: `Стадия "${stage}" не найдена` }, { status: 400 });
    }

    console.log(`Стадия "${stage}" найдена.`, stageObj);

    // Получаем текущий массив партнёров на стадии
    let currentArray = stageObj[stage];
    console.log('Текущие партнёры на стадии:', currentArray);

    const ids = currentArray.map((id: any) => id.toString());
    console.log('Текущие ID партнёров:', ids);

    // Если checked true — добавляем партнёра
    if (checked) {
      if (!ids.includes(partnerId)) {
        console.log(`Партнёр ${partnerId} не найден в стадии "${stage}". Добавляем...`);

        // Добавляем партнёра с помощью Mongoose и оператора $push
        await Manager.updateOne(
          { _id: managerId, "partnersStage._id": stageObj._id },
          { $push: { [`partnersStage.$.${stage}`]: partnerId } }
        );
        console.log(`Партнёр ${partnerId} добавлен в стадию "${stage}"`);
      } else {
        console.log(`Партнёр ${partnerId} уже в стадии "${stage}"`);
      }
    } else {
      // Если checked false — удаляем партнёра
      console.log(`Удаляем партнёра ${partnerId} из стадии "${stage}"`);

      await Manager.updateOne(
        { _id: managerId, "partnersStage._id": stageObj._id },
        { $pull: { [`partnersStage.$.${stage}`]: partnerId } }
      );
      console.log(`Партнёр ${partnerId} удалён из стадии "${stage}"`);
    }

    // Возвращаем успешный ответ
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Ошибка при обработке запроса:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}
