import { notFound } from 'next/navigation';
import ViewVacancy from "@/src/components/forms/VacancyForm/ViewVacancy";

const getVacancyById = async (id: string) => {
  try {
    const res = await fetch(`http://localhost:3000/api/vacancy/${id}`, {
      // const res = await fetch(`https://dashboard-etalones-tailadmin.vercel.app/api/vacancy/${id}`, {

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
console.log("Параметры GET", params);
  // Получаем вакансию на сервере
  const vacancy = await getVacancyById(id);

  if (!vacancy) {
    notFound();
  }

  return (
    <>
      <ViewVacancy vacancy={vacancy} />
      
    </>
  );
}
