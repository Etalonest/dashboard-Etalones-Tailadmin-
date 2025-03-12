'use client';

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import SidebarRight from "../SidebarRight";
import { Candidate } from "@/src/types/candidate";
import { useSession } from "next-auth/react";


export default function FromRecruiter() {
  const { data } = useSession();
  const managerRole = data?.managerRole || 'guest';
  const managerId = data?.managerId || '';
  const [candidates, setCandidates] = useState<any[]>([]); // Для хранения полученных данных
  const [loading, setLoading] = useState<boolean>(true); // Статус загрузки
  const [error, setError] = useState<string | null>(null); // Ошибка при запросе данных
  const [sidebarOpen, setSidebarOpen] = useState(false); // Статус открытого сайдбара
  const [formType, setFormType] = useState<"viewCandidate" | null>(null); // Тип формы для сайдбара
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null); // Выбранный кандидат
  const [completedTasks, setCompletedTasks] = useState<string[]>([]); // Для отслеживания выполненных задач

  // Функция для получения кандидатов
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await fetch(`/api/candidate-by-manager/${managerId}/fromRecruiter`); // Путь к API для получения кандидатов

        if (!response.ok) {
          throw new Error('Ошибка при получении данных');
        }

        const data = await response.json();
        console.log('Полученные кандидаты:', data); // Логируем данные для проверки

        setCandidates(data.candidates || []);
      } catch (error: any) {
        setError(error.message || 'Неизвестная ошибка');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []); // Запросим данные только при монтировании компонента

  const toggleSidebar = (type: "viewCandidate", candidate?: Candidate) => {
    setFormType(type);
    setSelectedCandidate(candidate || null);
    setSidebarOpen(prevState => !prevState);
  };

  const handleCheckboxChange = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'выполнена' ? 'не-выполнена' : 'выполнена';

    setCompletedTasks(prevState => {
      if (newStatus === 'выполнена') {
        return [...prevState, taskId];
      } else {
        return prevState.filter(id => id !== taskId);
      }
    });

    try {
      const response = await fetch(`/api/tasks/${taskId}/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при обновлении статуса задачи');
      }

      console.log(`Задача ${taskId} обновлена на ${newStatus}`);
    } catch (error) {
      console.error(error);
    }
  };

  const isNotifying = (tasks: any[]) => {
    return tasks.some((task: any) => task.status !== 'выполнена');
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  
  console.log("CANDIDATE##1", selectedCandidate)

  return (
    <div className="container">
      {/* Сайдбар */}
      <SidebarRight
        sidebarROpen={sidebarOpen}
        setSidebarROpen={setSidebarOpen}
        formType={formType}
        selectedCandidate={selectedCandidate}
      />

      {/* Таблица кандидатов */}
      <Table>
        <TableHeader>
          <TableRow className="grid grid-cols-12 gap-2">
            <TableHead className="font-bold ">Дата</TableHead>
            <TableHead className="font-bold ">Рекрутер</TableHead>
            <TableHead className="font-bold col-span-2">Имя кандидата</TableHead>
            <TableHead className="font-bold col-span-2">Профессия</TableHead>
            <TableHead className="font-bold col-span-2">Вакансия</TableHead>
            <TableHead className="font-bold col-span-4 ">Задачи</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.length === 0 ? (
            <div>Нет кандидатов для отображения</div>
          ) : (
            candidates.map((item, index) => (
              <TableRow key={index} className="grid grid-cols-12 gap-2">
                <TableCell>
                  <Badge className="text-green-800 w-max">
                  {`${new Date(item.createdAt).toLocaleDateString('ru-RU', {
                      day: '2-digit', month: '2-digit', year: '2-digit',
                    })}`}                  </Badge>
                </TableCell>

                <TableCell className="text-sm">
                  {item?.recruiter?.name }
                </TableCell>

                    <HoverCard>
                <TableCell className="font-bold col-span-2" onClick={() => toggleSidebar("viewCandidate", item)}>
                      <HoverCardTrigger  asChild>
                  <p className="text-md font-bold text-black cursor-pointer">{item.name}</p>
                      </HoverCardTrigger >
                      <HoverCardContent  className="bg-white px-2 py-1 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 backdrop-blur-sm">
                        <p className="text-md font-bold">{item.stages?.comment}</p>
                      </HoverCardContent >
                </TableCell>
                    </HoverCard>

                <TableCell className="font-bold col-span-2 cursor-pointer" >
                  {item.professions.map((profession: any, index: number) => (
                    <div key={index}>
                      {profession.name}
                    </div>
                  ))}
                </TableCell>
                  <TableCell className="col-span-2">
                    <p className="text-md font-bold">{item.stages?.vacancy?.title}</p>
                    <p className="text-md ">{item.stages?.vacancy?.partner?.companyName} - {item.stages?.vacancy?.partner?.name}</p>
                  </TableCell>
                  <HoverCard>
              <TableCell className="col-span-4 flex flex-col gap-2">
                {item.stages?.tasks.map((task: any, index: number) => (
                  <><div className="flex gap-2">
                    <Checkbox
                    checked={completedTasks.includes(task._id) || task.status === 'выполнена'}
                    onCheckedChange={() => handleCheckboxChange(task._id, task.status)}
                    />
                  <HoverCardTrigger asChild key={index}> 
                    <p className="text-md font-bold text-black cursor-pointer">{task.taskName}</p>
                  </HoverCardTrigger>
                  </div>
                  <HoverCardContent className="bg-white px-2 py-1 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 backdrop-blur-sm">
                      <p className="text-md font-bold">{task.dueDate}</p>
                      <p className="text-md ">{task.status}</p>
                    </HoverCardContent></> ))}
              </TableCell>
                </HoverCard>

                </TableRow>
             
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
