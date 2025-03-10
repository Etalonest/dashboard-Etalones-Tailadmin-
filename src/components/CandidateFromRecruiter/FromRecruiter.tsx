'use client';

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import SidebarRight from "../SidebarRight";
import { Candidate } from "@/src/types/candidate";
import { useSession } from "next-auth/react";
import { div } from "framer-motion/client";

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
            <TableHead className="font-bold ">Вакансия</TableHead>
            <TableHead className="font-bold col-span-3 ">Комментарий</TableHead>
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

                <TableCell className="font-bold col-span-2" onClick={() => toggleSidebar("viewCandidate", item.candidate)}>
                  {item.name}
                </TableCell>

                <TableCell className="font-bold col-span-2 cursor-pointer" >
                  {item.professions.map((profession: any, index: number) => (
                    <div key={index}>
                      {profession.name}
                    </div>
                  ))}
                </TableCell>

                <TableCell className="font-bold">
                  <HoverCard>
                    <HoverCardTrigger>
                      <p>{item.stages?.vacancy?.title}</p>
                    </HoverCardTrigger>
                    <HoverCardContent>
                      {/* <div>Партнёр: {item.vacancy?.partner?.companyName}</div>
                      <div><span>Город:</span> {item.vacancy?.location}</div>
                      <div><span>Зарплата:</span> {item.vacancy?.salary}</div>
                      <div><span>Проживание:</span> {item.vacancy?.homePrice}</div> */}
                    </HoverCardContent>
                  </HoverCard>
                </TableCell>

                {/* <TableCell className="text-sm col-span-2 flex flex-col">
                  <HoverCard>
                    <HoverCardTrigger>
                      <p className="text-sm font-bold cursor-pointer">Комментарий</p>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      {item.comment}
                    </HoverCardContent>
                  </HoverCard>
                  <HoverCard>
                    <HoverCardTrigger>
                      <p className="text-sm font-bold cursor-pointer relative">Задачи</p>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-max flex flex-col">
                      {item.tasks.map((task: any, index: number) => (
                        <div key={task._id} className="flex flex-row items-center gap-2">
                          <Checkbox
                            checked={completedTasks.includes(task._id) || task.status === 'выполнена'}
                            onCheckedChange={() => handleCheckboxChange(task._id, task.status)}
                          />
                          {index + 1}. {task.taskName}
                          <span>({task.description})</span>
                        </div>
                      ))}
                    </HoverCardContent>
                  </HoverCard>
                </TableCell> */}

                {/* <TableCell className="text-sm">
                  {item.responsible?.name}
                </TableCell> */}

                {/* <TableCell className="text-sm col-span-3">
                  {item?.comment}
                </TableCell> */}
              </TableRow>
             
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
