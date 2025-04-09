// import { connectDB } from '@/src/lib/db'; // Подключение к базе данных
// import Stage from '@/src/models/Stage'; // Модель для стадий кандидатов (предположим, что такая модель существует)

// export async function GET(req: Request) {
//   try {
//     console.log('Запрос на получение данных стадии кандидатов начат...');

//     // Подключаемся к базе данных
//     console.log('Подключаемся к базе данных...');
//     await connectDB();
//     console.log('Подключение к базе данных успешно.');

//     // Получаем все стадии кандидатов
//     console.log('Запрашиваем стадии кандидатов...');
//     const stages = await Stage.find({
//       _id: {
//         $in: [
//           process.env.NEXT_PUBLIC_CANDIDATES_STAGE_NEW,
//           process.env.NEXT_PUBLIC_CANDIDATES_STAGE_PROCESSING,
//           process.env.NEXT_PUBLIC_CANDIDATES_STAGE_ON_INTERVIEW,
//           process.env.NEXT_PUBLIC_CANDIDATES_STAGE_INTERVIEW_SUCCESS,
//           process.env.NEXT_PUBLIC_CANDIDATES_STAGE_REJECTED,
//           process.env.NEXT_PUBLIC_CANDIDATES_STAGE_ON_OBJECT
//         ]
//       }
//     });

//     console.log('Стадии кандидатов получены:', stages);

//     if (stages.length === 0) {
//       console.warn('Нет стадий кандидатов!');
//     }

//     // Подсчитываем количество кандидатов на каждой стадии
//     const counts = stages.reduce((acc, stage) => {
//       acc[stage.name] = stage.candidates.length; // Подсчитываем длину массива кандидатов
//       return acc;
//     }, {});

//     console.log('Подсчитанные данные по кандидатам:', counts);

//     // Отправляем результат
//     return new Response(JSON.stringify(counts), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error('Ошибка при подсчете кандидатов:', error);
//     return new Response(
//       JSON.stringify({ error: 'Ошибка при подсчете кандидатов' }),
//       { status: 500 }
//     );
//   }
// }
import { connectDB } from '@/src/lib/db'; // Подключение к базе данных
import Stage from '@/src/models/Stage'; // Модель для стадии кандидатов

interface CandidateStageMap {
  [candidateId: string]: string[]; // Ключ - ID кандидата, значение - массив стадий
}

interface StageCount {
  name: string;
  candidatesCount: number;
}

export async function GET(req: Request): Promise<Response> {
  try {
    console.log('Запрос на получение данных стадии кандидатов начат...');

    // Подключаемся к базе данных
    console.log('Подключаемся к базе данных...');
    await connectDB();
    console.log('Подключение к базе данных успешно.');

    // Массив идентификаторов стадий, которые нужно использовать
    const stagesIds = [
      process.env.NEXT_PUBLIC_CANDIDATES_STAGE_NEW,
      process.env.NEXT_PUBLIC_CANDIDATES_STAGE_PROCESSING,
      process.env.NEXT_PUBLIC_CANDIDATES_STAGE_ON_INTERVIEW,
      process.env.NEXT_PUBLIC_CANDIDATES_STAGE_INTERVIEW_SUCCESS,
      process.env.NEXT_PUBLIC_CANDIDATES_STAGE_REJECTED,
      process.env.NEXT_PUBLIC_CANDIDATES_STAGE_ON_OBJECT
    ];

    // Логируем список идентификаторов стадий
    console.log('Идентификаторы стадий:', stagesIds);

    // Выполняем запрос к базе данных для получения стадий
    const stages = await Stage.find({
      _id: { $in: stagesIds } // Находим стадии по идентификаторам
    });

    // Логируем стадии, которые были получены
    console.log('Полученные стадии:', stages);

    // Объект для хранения всех кандидатов и стадий, где они находятся
    const candidateStageMap: CandidateStageMap = {};

    // Массив для подсчета данных по каждой стадии
    const counts: StageCount[] = stages.map((stage) => {
      // Проходим по кандидатам в каждой стадии
      stage.candidates.forEach((candidateId: string) => {
        // Если кандидат еще не был добавлен в объект
        if (!candidateStageMap[candidateId]) {
          candidateStageMap[candidateId] = [];
        }

        // Добавляем текущую стадию в список стадий для этого кандидата
        candidateStageMap[candidateId].push(stage.name);
      });

      return {
        name: stage.name,
        candidatesCount: stage.candidates.length // Подсчитываем всех кандидатов на стадии (включая возможные дубли)
      };
    });

    // Логируем дублированных кандидатов
    const duplicates = Object.keys(candidateStageMap).filter(candidateId => candidateStageMap[candidateId].length > 1);
    if (duplicates.length > 0) {
      console.log('Дублированные кандидаты:');
      duplicates.forEach(candidateId => {
        console.log(`Кандидат ID: ${candidateId} находится на следующих стадиях: ${candidateStageMap[candidateId].join(', ')}`);
      });
    } else {
      console.log('Дублированных кандидатов нет.');
    }

    // Логируем итоговые данные
    console.log('Подсчитанные данные по кандидатам:', counts);

    // Отправляем результат
    return new Response(JSON.stringify(counts), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Ошибка при подсчете кандидатов:', error);
    return new Response(
      JSON.stringify({ error: 'Ошибка при подсчете кандидатов' }),
      { status: 500 }
    );
  }
}
