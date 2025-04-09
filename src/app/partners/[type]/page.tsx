'use client'

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useManager } from '@/src/context/ManagerContext';
import { Partner } from '@/src/types/partner'; // Тип Partner

export default function PartnersByTypePage() {
  const { partnersStage, isLoading, error, partners } = useManager(); // Данные партнёров из контекста
  const params = useParams(); // Получаем параметры из URL
  const [partnersData, setPartnersData] = useState<Partner[]>([]); // Состояние для партнёров

  const type = Array.isArray(params?.type) ? params.type[0] : params?.type || 'all'; // Получаем тип из URL

  useEffect(() => {
    if (!partnersStage || partnersStage.length === 0) return;

    console.log("Partners stage data:", partnersStage);

    // Собираем партнёров для отображения
    let partnersToDisplay: Partner[] = [];

    partnersStage.forEach((stage) => {
      if (stage.peopleOnObj) {
        // Добавляем партнёров, находящихся на объекте
        partnersToDisplay = [
          ...partnersToDisplay,
          ...stage.peopleOnObj
        ];
      }

      if (stage.inWork) {
        // Добавляем партнёров, находящихся в процессе работы
        partnersToDisplay = [
          ...partnersToDisplay,
          ...stage.inWork
        ];
      }
    });

    // Убираем дублирующиеся объекты, если они есть
    const uniquePartners = Array.from(new Set(partnersToDisplay.map((p) => p._id)))
      .map((id) => partnersToDisplay.find((p) => p._id === id));

    setPartnersData(uniquePartners);

  }, [type, partnersStage]); // Перезапуск фильтрации, когда меняется тип или партнёры в стадии

  const translateType = (type: string) => {
    switch (type) {
      case 'all':
        return 'Все партнёры';
      case 'onObject':
        return 'На объекте';
      case 'negotiations':
        return 'На переговорах';
      case 'inProgress':
        return 'В процессе';
      default:
        return 'Неизвестный тип';
    }
  };

  // Функция для поиска партнёра по ID в массиве partners
  const getPartnerById = (id: string): Partner | undefined => {
    const partner = partners.find((partner) => partner._id === id);
    return partner;
  };

  return (
    <div>
      <h1>{translateType(type)}</h1>
      {isLoading && <p>Загрузка...</p>}
      {error && <p>Ошибка: {error}</p>}
      {partnersData.length === 0 && <p>Нет партнёров для выбранного типа.</p>}

      <div>
        {partnersData.map((partner, index) => (
          <div key={index}>
            <h3>{partner.companyName}</h3>
            <p>Имя: {partner.name}</p>
            <p>Телефон: {partner.phone}</p>
            <p>Сайт: <a href={`https://${partner.site}`}>{partner.site}</a></p>
            <p>Электронная почта: {partner.email}</p>
            <p>Компания: {partner.companyName}</p>
            {/* Можно добавить другие поля, если нужно */}
          </div>
        ))}
      </div>
    </div>
  );
}
