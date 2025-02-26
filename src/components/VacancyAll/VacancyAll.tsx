'use client';
import React, { useEffect, useState } from 'react';

// Типизация вакансий
interface Vacancy {
  _id: string;
  title: string;
  partner: {
    companyName: string;
  };
  manager: {
    name: string;
    phone: string;
  };
}

export const VacancyAll: React.FC = () => {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/vacancy');

        if (!response.ok) {
          throw new Error('Failed to fetch vacancy');
        }

        const data: Vacancy[] = await response.json(); // Типизируем данные как Vacancy[]
        setVacancies(data); // Сохраняем данные вакансий в состоянии
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []); // Пустой массив зависимостей, чтобы запрос выполнялся только один раз

  return (
    <div>
      <h1>Все вакансии</h1>
      <ul>
        {vacancies.length > 0 ? (
          vacancies.map((vacancy) => (
            <li key={vacancy._id}>
              <h3>{vacancy.title}</h3>
              <p>Компания: {vacancy.partner?.companyName}</p>
              <p>Менеджер: {vacancy.manager?.name}</p>
              <p>Телефон: {vacancy.manager?.phone}</p>
            </li>
          ))
        ) : (
          <p>Вакансии не найдены</p>
        )}
      </ul>
    </div>
  );
};
