'use client'
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { VacancyType } from "@/src/types/vacancy";
import { MapPinned, HandCoins, HousePlus } from "lucide-react";
import { useState, useEffect } from "react";

export function DrawerBody({ candidate, managerId }: { candidate: any; managerId: any }) {
  const [vacancies, setVacancies] = useState<VacancyType[]>([]); 
  const [selectedVacancy, setSelectedVacancy] = useState<VacancyType | null>(null);
  const [comment, setComment] = useState("");
  const [candidateId, setCandidateId] = useState(candidate._id);



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
    };

    try {
      const response = await fetch('/api/candidates/stage/onInterview', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error("Ошибка при отправке данных");

      alert("Заявка отправлена успешно");
      setComment(""); // Очистить комментарий
      setSelectedVacancy(null); // Очистить выбор
    } catch (error) {
      console.error(error);
      alert("Ошибка при отправке заявки");
    }
  };
  return (
    <div className="grid grid-cols-2 gap-2 p-4">
      <ScrollArea className="h-[350px] flex justify-center items-center">
        {vacancies.map((vacancy) => (
          <div 
            key={vacancy._id} 
            className="w-full flex justify-start items-center gap-2 rounded-md border p-2 cursor-pointer"
            onClick={() => setSelectedVacancy(vacancy)}
          >
            <Checkbox checked={selectedVacancy?._id === vacancy._id} />
            <div className="text-xl font-bold">{vacancy.title}</div>
            <div className="text-sm text-gray-600 flex gap-2 items-center">
              <MapPinned />
              <span>{vacancy.location}</span>
            </div>
            <div className="flex gap-2 items-center justify-start">
              <HandCoins />
              <span className="font-bold">{vacancy.salary}</span>
              <span className="text-sm text-gray-600">НЕТТО</span>
            </div>
            <div className="flex gap-2 items-center justify-start">
              <HousePlus />
              <span className="font-bold">{vacancy.homePrice}</span>
            </div>
          </div>
        ))}
      </ScrollArea>

      {selectedVacancy && (
        <form className="p-4 border rounded-md" onSubmit={handleSubmit}>
          <p className="text-lg font-semibold">
            Вы хотите отправить кандидата {candidate?.name} на собеседование по вакансии "{selectedVacancy.title}" в город {selectedVacancy.location}?
          </p>
          <p className="text-sm text-gray-600">
            Куратор: {selectedVacancy.manager?.name}
          </p>
          <div>
<Label className="text-sm font-semibold">
  Комментарий:
</Label>
          <Textarea className="h-40" value={comment}
            onChange={(e) => setComment(e.target.value)}/>
          <Button type="submit" className="my-2">Отправить</Button>
          </div>
        </form>
      )}
    </div>
  );
}
