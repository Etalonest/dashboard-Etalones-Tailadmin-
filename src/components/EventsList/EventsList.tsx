'use client';
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useEffect, useState } from "react";
import usePushNotification from "@/src/hooks/usePushNotification";

export default function EventsList() {
  // Применяем хук для подписки на пуш-уведомления
  usePushNotification();

  const [eventHistory, setEventHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`/api/eventHistory`, {
          headers: {
            'Cache-Control': 'no-cache',  // предотвращаем кэширование
          },
        });

        if (!response.ok) {
          throw new Error("Ошибка при получении данных");
        }

        const data = await response.json();
        console.log(data);  // для дебага: посмотри, что пришло с сервера

        // Сортируем события по дате в убывающем порядке
        const sortedData = data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setEventHistory(sortedData);  // Сохраняем отсортированные события
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);  // загрузка завершена
      }
    };

    fetchEvents();
  }, []);

  // Функция для группировки событий по дате
  const groupEventsByDate = (events: any[]) => {
    return events.reduce((acc, event) => {
      const date = new Date(event.createdAt);
      const dateString = date.toLocaleDateString("en-GB"); // Форматируем как "DD/MM/YYYY"
      
      if (!acc[dateString]) {
        acc[dateString] = [];
      }
      acc[dateString].push(event);
      return acc;
    }, {});
  };

  // Группируем события по дате
  const groupedEvents = groupEventsByDate(eventHistory);

  return (
    <div className="mt-5">
      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <div>
          {Object.keys(groupedEvents).length > 0 ? (
            Object.keys(groupedEvents).map((date) => (
              <div key={date} className="mb-5">
                <h2 className="text-lg font-bold">{date}</h2> {/* Отображаем дату */}
                {groupedEvents[date].map((event: any) => (
                  <div key={event._id} className="flex flex-col gap-2 justify-center items-start">
                    <div className="w-full border-b border-slate-400 pb-2"></div>
                    <div className="flex items-center gap-5 self-end">
                      <span className="text-sm">{new Date(event.createdAt).toLocaleString()}</span>
                      <span className="text-md">{event?.manager?.name}</span>
                    </div>
                    <div className="flex gap-5">
                      <Badge className="bg-green-300">{event.eventType}</Badge>
                      <span className="text-slate-400">
                        <Link href={`/candidate/${event?.relatedId?._id}`} target="blank">
                          {event.description} <span>{event?.appointed?.name}</span>
                        </Link>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p>Нет событий для отображения.</p>
          )}
        </div>
      )}
    </div>
  );
}
