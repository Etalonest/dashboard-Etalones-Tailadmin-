'use client'
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/src/components/DatePicker/DatePicker"; // Предположим, у вас есть компонент для выбора даты
import { VacancyType } from "@/src/types/vacancy";
import { useState, useEffect } from "react";

export function DrawerBody({ candidate, managerId, vacancy }: { candidate: any; managerId: any; vacancy: any }) {

  const { toast } = useToast();
  const [comment, setComment] = useState("");
  const [candidateId, setCandidateId] = useState(candidate._id);
  const [response, setResponse] = useState<'positive' | 'negative' | null>(null); // Состояние для выбора положительно/отрицательно
  const [arrivalDate, setArrivalDate] = useState<Date | null>(null); // Для выбора даты приезда
  const [reason, setReason] = useState(''); // Для ввода комментария

  useEffect(() => {
    setCandidateId(candidate._id);
  }, [candidate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    // Создаем объект для отправки данных в зависимости от ответа
    const requestBody: Record<string, any> = {
      arrivalDate,
      vacancyId: vacancy._id,
      candidateId,
      managerId,
      response,
    };

    if (response === 'positive') {
      requestBody.arrivalDate = arrivalDate; // Дата прибытия для положительного ответа
    }

    if (response === 'negative') {
      requestBody.comment = reason; // Комментарий для отрицательного ответа
    }

    try {
      const apiEndpoint = response === 'positive' 
        ? '/api/candidates/stage/onInterview/success'
        : '/api/candidates/stage/onInterview/rejected';

      const apiResponse = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!apiResponse.ok) throw new Error("Ошибка при отправке данных");

      toast({
        title: response === 'positive' ? "Кандидат успешно принят на \"Работу\"" : "Кандидат отклонён",
        description: response === 'positive' 
          ? "Для просмотра кандидатов перейдите в раздел \"Кандидаты на собеседовании\""
          : "Кандидат был отклонён",
        duration: 5000,
        variant: "destructive",
      });

      // Сброс состояния после отправки данных
      setComment(""); // Очистить комментарий
      setResponse(null); // Очистить состояние выбора
      setArrivalDate(null); // Очистить дату
      setReason(''); // Очистить причину
    } catch (error) {
      console.error(error);
      alert("Ошибка при отправке заявки");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-4">
      <div>
        <Label className="text-sm font-semibold">Ответ:</Label>
        <div className="flex gap-2">
          <Button
          type="button"
            onClick={() => setResponse('positive')}
            className="bg-green-500 text-white"
          >
            Положительно
          </Button>
          <Button
          type="button"
            onClick={() => setResponse('negative')}
            variant="destructive"
          >
            Отрицательно
          </Button>
        </div>
      </div>

      {/* Вторая колонка */}
      <div>
        {response === 'positive' && (
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold">Дата приезда:</Label>
            <DatePicker value={arrivalDate} onChange={setArrivalDate} />
          </div>
        )}

        {response === 'negative' && (
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold">Причина:</Label>
            <Textarea
              className="h-40 w-[400px]"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Укажите причину"
            />
          </div>
        )}
      </div>

      <Button type="submit" className="my-2">Отправить</Button>
    </form>
  );
}
