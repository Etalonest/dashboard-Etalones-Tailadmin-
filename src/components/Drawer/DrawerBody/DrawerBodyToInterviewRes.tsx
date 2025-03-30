'use client'
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/src/components/DatePicker/DatePicker"; // Предположим, у вас есть компонент для выбора даты
import { VacancyType } from "@/src/types/vacancy";
import { MapPinned, HandCoins, HousePlus } from "lucide-react";
import { useState, useEffect } from "react";

export function DrawerBody({ candidate, managerId }: { candidate: any; managerId: any }) {
  const { toast } = useToast()
  const [vacancies, setVacancies] = useState<VacancyType[]>([]); 
  const [selectedVacancy, setSelectedVacancy] = useState<VacancyType | null>(null);
  const [comment, setComment] = useState("");
  const [candidateId, setCandidateId] = useState(candidate._id);
  const [response, setResponse] = useState<'positive' | 'negative' | null>(null); // Состояние для выбора положительно/отрицательно
  const [arrivalDate, setArrivalDate] = useState<Date | null>(null); // Для выбора даты приезда
  const [reason, setReason] = useState(''); // Для ввода причины

  useEffect(() => {
    setCandidateId(candidate._id);
  }, [candidate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/vacancy');
        if (!response.ok) {
          throw new Error('Failed to fetch vacancy');
        }
        const data: VacancyType[] = await response.json();
        setVacancies(data); 
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVacancy) return;
    const requestBody = {
      vacancyId: selectedVacancy._id,
      candidateId,
      managerId,
      comment,
      response,
      arrivalDate,
      reason,
    };

    try {
      const response = await fetch('/api/candidates/stage/onInterview', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error("Ошибка при отправке данных");

      toast({
        title: "Кандидат успешно передан в \"На собеседовании\"",
        description: "Для просмотра кандидатов перейдите в раздел \"Кандидаты на собеседовании\"",
        duration: 5000,
        variant: "destructive",
      })
      setComment(""); // Очистить комментарий
      setSelectedVacancy(null); // Очистить выбор
      setResponse(null); // Очистить состояние выбора
      setArrivalDate(null); // Очистить дату
      setReason(''); // Очистить причину
    } catch (error) {
      console.error(error);
      alert("Ошибка при отправке заявки");
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2 p-4">
      <div>
        <Label className="text-sm font-semibold">Ответ:</Label>
        <div className="flex gap-2">
          <Button
            onClick={() => setResponse('positive')}
            className="bg-green-500 text-white"
          >
            Положительно
          </Button>
          <Button
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
          <div>
            <Label className="text-sm font-semibold">Дата приезда:</Label>
            <DatePicker value={arrivalDate} onChange={setArrivalDate} />
          </div>
        )}

        {response === 'negative' && (
          <div>
            <Label className="text-sm font-semibold">Причина:</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Укажите причину"
            />
          </div>
        )}

        {selectedVacancy && (
          <form className="p-4 border rounded-md" onSubmit={handleSubmit}>
            <p className="text-lg font-semibold">
              Вы хотите отправить кандидата {candidate?.name} на собеседование по вакансии "{selectedVacancy.title}" в город {selectedVacancy.location}?
            </p>
            <p className="text-sm text-gray-600">
              Куратор: {selectedVacancy.manager?.name}
            </p>
            <div>
              <Label className="text-sm font-semibold">Комментарий:</Label>
              <Textarea className="h-40" value={comment} onChange={(e) => setComment(e.target.value)} />
              <Button type="submit" className="my-2">Отправить</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
