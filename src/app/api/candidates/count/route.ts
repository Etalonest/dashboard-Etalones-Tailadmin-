import { connectDB } from '@/src/lib/db'; // Подключение к базе данных
import Stage from '@/src/models/Stage'; // Модель для стадий кандидатов (предположим, что такая модель существует)

export async function GET(req: Request) {
  try {
    console.log('Запрос на получение данных стадии кандидатов начат...');

    // Подключаемся к базе данных
    console.log('Подключаемся к базе данных...');
    await connectDB();
    console.log('Подключение к базе данных успешно.');

    // Получаем все стадии кандидатов
    console.log('Запрашиваем стадии кандидатов...');
    const stages = await Stage.find({
      _id: {
        $in: [
          process.env.NEXT_PUBLIC_CANDIDATES_STAGE_NEW,
          process.env.NEXT_PUBLIC_CANDIDATES_STAGE_PROCESSING,
          process.env.NEXT_PUBLIC_CANDIDATES_STAGE_ON_INTERVIEW,
          process.env.NEXT_PUBLIC_CANDIDATES_STAGE_INTERVIEW_SUCCESS,
          process.env.NEXT_PUBLIC_CANDIDATES_STAGE_REJECTED,
          process.env.NEXT_PUBLIC_CANDIDATES_STAGE_ON_OBJECT
        ]
      }
    });

    console.log('Стадии кандидатов получены:', stages);

    if (stages.length === 0) {
      console.warn('Нет стадий кандидатов!');
    }

    // Подсчитываем количество кандидатов на каждой стадии
    const counts = stages.reduce((acc, stage) => {
      acc[stage.name] = stage.candidates.length; // Подсчитываем длину массива кандидатов
      return acc;
    }, {});

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
