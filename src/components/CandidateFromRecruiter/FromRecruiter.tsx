'use client'

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import SidebarRight from "../SidebarRight";
import { Candidate } from "@/src/types/candidate";
import { useSession } from "next-auth/react";
export default function FromRecruiter() {
  const { data } = useSession()
  const managerRole = data?.managerRole || 'guest';
  const [stageData, setStageData] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formType, setFormType] = useState<"viewCandidate" | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  useEffect(() => {
    if (managerRole === 'manager') {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/stages', {
          // headers: {
          //   'Cache-Control': 'no-cache',
          // },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch stages');
        }

        const data = await response.json();
        console.log(data);

        const sortedData = data.sort((a: any, b: any) => {
          const stageOrder = ['recruiter', 'curator'];
          const stageA = stageOrder.indexOf(a.stage);
          const stageB = stageOrder.indexOf(b.stage);

          if (stageA === stageB) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }

          return stageA - stageB;
        });

        setStageData(sortedData); 
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }}, []);

  const toggleSidebar = (type: "viewCandidate", candidate?: Candidate) => {
    setFormType(type);
    setSelectedCandidate(candidate || null);
    setSidebarOpen(prevState => !prevState);
  };
  const handleCheckboxChange = async (
    taskId: string, 
    currentStatus: string
  ) => {
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
  
  // const handleCheckboxChange = async (
  //   taskId: string, 
  //   taskName: string,
  //   status: string, 
  //   candidateId: string, 
  //   vacancy: any) => {
  //   const newStatus = status === 'выполнена' ? 'не-выполнена' : 'выполнена';

  //   setCompletedTasks(prevState => {
  //     if (newStatus === 'выполнена') {
  //       return [...prevState, taskId];
  //     } else {
  //       return prevState.filter(id => id !== taskId);
  //     }
  //   });

  //   try {
  //     const response = await fetch(`/api/tasks/${taskId}/update`, {
  //       method: 'PATCH',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ status: newStatus }),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Ошибка при обновлении статуса задачи');
  //     }

  //     console.log(`Задача ${taskId} обновлена на ${newStatus}`);
  //     if (newStatus === 'выполнена' && taskName === 'Передать на собеседование') {
  //       // Отправляем запрос на создание интервью
  //       const interviewResponse = await fetch('/api/interview', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           vacancy: vacancy, // вакансия, к которой нужно назначить собеседование
  //           manager: managerId, // менеждер, назначивший собеседование
  //           candidateId: candidateId, // ID кандидата
  //           date: new Date(), // Дата собеседования (можно задать свою)
  //           comment: 'Собеседование назначено после выполнения задачи', // Комментарий
  //         }),
  //       });
  
  //       if (!interviewResponse.ok) {
  //         throw new Error('Ошибка при создании собеседования');
  //       }
  
  //       console.log(`Интервью создано для кандидата ${candidateId}`);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const isNotifying = (tasks: any[]) => {
    return tasks.some((task: any) => task.status !== 'выполнена');
  };

  return (
    <>
      <div className="">
        <SidebarRight
          sidebarROpen={sidebarOpen}
          setSidebarROpen={setSidebarOpen}
          formType={formType}
          selectedCandidate={selectedCandidate}
        />
        <Table>
          <TableHeader>
            <TableRow className="grid grid-cols-12 gap-2">
              <TableHead className="font-bold ">Стадия</TableHead>
              <TableHead className="font-bold ">Передан</TableHead>
              <TableHead className="font-bold">Рекрутером</TableHead>
              <TableHead className="font-bold col-span-2">Имя кандидата</TableHead>
              <TableHead className="font-bold ">Вакансия</TableHead>
              <TableHead className="font-bold col-span-2">Дополнительно</TableHead>
              <TableHead className="font-bold ">Ответствен.</TableHead>
              <TableHead className="font-bold col-span-3 ">Комментарий</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stageData.map((item, index) => (
              <TableRow key={index} className="grid grid-cols-12 gap-2">
                <TableCell>
  <Badge className="text-green-800 w-max">

  {item.stage === 'recruiter' ? 'У рекрутера' : item.stage === 'curator' ? 'У куратора' : ''}
  </Badge>
</TableCell>

                <TableCell className="text-sm">
                  <Badge>
                    {`${new Date(item.createdAt).toLocaleDateString('ru-RU', {
                      day: '2-digit', month: '2-digit', year: '2-digit',
                    })}`}
                  </Badge>
                </TableCell>
                <TableCell className="font-bold">
                {item?.appointed?.name || item?.responsible?.name}
                </TableCell>
                <TableCell className="font-bold col-span-2 cursor-pointer" onClick={() => toggleSidebar("viewCandidate", item.candidate)}>
                  {item.candidate?.name}
                </TableCell>
                <TableCell className="font-bold ">
                  <HoverCard>
                    <HoverCardTrigger>
                      <p>{item.vacancy?.title}</p>
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <div>Партнёр: {item.vacancy?.partner?.companyName}</div>
                      <div><span>Город:</span> {item.vacancy?.location}</div>
                      <div><span>Зарплата:</span> {item.vacancy?.salary}</div>
                      <div><span>Проживание:</span> {item.vacancy?.homePrice}</div>
                      <div><span>Документы:</span>
                        {item.vacancy?.documents.map((doc: any, index: number) => (
                          <div key={index}>{doc}</div>
                        ))}
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </TableCell>

                <TableCell className="text-sm col-span-2 flex flex-col">
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
                      <p className="text-sm font-bold cursor-pointer relative">Задачи
                        <span
                          className={`absolute -left-0.5 -top-0 z-1 h-2 w-2 rounded-full bg-meta-1 ${isNotifying(item.tasks) ? "inline" : "hidden"}`}
                        >
                          <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-meta-1 opacity-75"></span>
                        </span>
                      </p>
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
                </TableCell>
                <TableCell className="text-sm ">
                  {item.responsible?.name}
                </TableCell>
                <TableCell className="text-sm col-span-3">
                  {item.comment}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
