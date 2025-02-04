// import ViewVacancy from "@/src/components/forms/VacancyForm/ViewVacancy"; 

// const getVacancyById = async (id: any) => {
//     try {
//         // Запрос к API для получения данных о вакансии по id
//         const res = await fetch(`http://localhost:3000/api/vacancy/${id}`, {
//             cache: 'no-store',  // Устанавливаем no-store, чтобы запрос не кэшировался
//         });

//         if (!res.ok) {
//             throw new Error('Failed to fetch vacancy');
//         }

//         return res.json();
//     } catch (error) {
//         console.log(error);
//     }
// };

// export default async function Page({ params }: any) {
//     const { id } = params;  // Получаем id вакансии из параметров URL

//     const { vacancy } = await getVacancyById(id);  // Получаем данные о вакансии по id

//     // Переходим к отображению данных вакансии
//     return (
//         <>
//             <ViewVacancy vacancy={vacancy} />
//         </>
//     );
// }
import { notFound } from 'next/navigation';
import ViewVacancy from "@/src/components/forms/VacancyForm/ViewVacancy";

// Функция для получения вакансии по ID
const getVacancyById = async (id: string) => {
  try {
    const res = await fetch(`http://localhost:3000/api/vacancy/${id}`, {
      cache: 'no-store', // Отключаем кэширование для свежих данных
    });

    if (!res.ok) {
      throw new Error('Failed to fetch vacancy');
    }

    return await res.json();
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Страница вакансии
export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  // Получаем вакансию на сервере
  const vacancy = await getVacancyById(id);

  // Если вакансия не найдена, показываем 404 страницу
  if (!vacancy) {
    notFound();
  }

  return (
    <>
      <ViewVacancy vacancy={vacancy} />
    </>
  );
}
