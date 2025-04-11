'use client';

import { useParams } from 'next/navigation';
import { useManager } from '@/src/context/ManagerContext';
import { Partner } from '@/src/types/partner';

export default function PartnersByTypePage() {
  const { partnersStage, isLoading, error } = useManager();
  const params = useParams();
  
  // Получаем тип из URL (если он есть)
  const type = Array.isArray(params?.type) ? params.type[0] : params?.type || 'checkPeople';

  console.log('Тип, полученный из URL:', type); // Проверка параметра из URL

  // Маппинг URL типа в ключ контекста
  const typeKeyMap: Record<string, string> = {
    peopleOnObj: 'peopleOnObj',
    checkPeople: 'checkPeople',
    inProgress: 'inProgress',
  };

  // Получаем ключ для выбранной стадии из typeKeyMap
  const stageKey = typeKeyMap[type] || 'checkPeople';

  console.log('Тип выбранной стадии:', stageKey); // Логируем, какой ключ мы выбрали

  // Логируем данные, полученные из контекста
  console.log('Данные из контекста (partnersStage):', partnersStage);

  // Ищем стадию в partnersStage по stageKey
  const selectedStage = partnersStage.find((stage) => stage.hasOwnProperty(stageKey));

  console.log('Выбранная стадия:', selectedStage); // Проверка, нашли ли мы нужную стадию

  if (!selectedStage) {
    return (
      <div className="text-center text-gray-500">
        Нет партнёров для этой стадии
      </div>
    );
  }

  // Получаем список партнёров для выбранной стадии
  const partnersList = selectedStage[stageKey] || [];
  console.log(`Список партнёров для стадии ${stageKey} из контекста:`, partnersList);

  if (isLoading) return <div className="p-6 text-center">Загрузка...</div>;
  if (error) return <div className="p-6 text-red-500">Ошибка: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-8">{translateType(type)}</h1>

      {/* Если партнёров нет, выводим сообщение */}
      {partnersList.length === 0 ? (
        <div className="text-center text-gray-500">Нет партнёров для этой стадии</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 max-w-md sm:max-w-screen-md lg:max-w-screen-lg w-full mx-auto">
          {partnersList.map((partner: Partner) => (
            <div key={partner._id} className="bg-white shadow p-4 rounded">
              <h2 className="font-semibold text-lg">{partner.name}</h2>
              <p className="text-gray-600 text-sm mt-1">{partner.email || 'Без email'}</p>
              <p className="text-gray-600 text-sm">{partner.phone || 'Без номера'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Функция для перевода типа в название
function translateType(type: string) {
  switch (type) {
    case 'peopleOnObj':
      return 'Люди на объекте';
    case 'checkPeople':
      return 'Ждёт людей';
    case 'inProgress':
      return 'В процессе';
    default:
      return 'Неизвестный тип';
  }
}
