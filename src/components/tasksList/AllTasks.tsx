// 'use client';

// import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
// import { useEffect, useState, useCallback } from "react";
// import { useSession } from "next-auth/react";
// import Select from "../inputs/Select/Select";
// import { taskStats } from "@/src/config/constants";
// import { useSearchParams } from 'next/navigation'; // Для фильтрации через параметры URL

// export default function AllTasks() {
//   const { data: session } = useSession();
//   const managerId = session?.managerId;
//   const [tasks, setTasks] = useState<any[]>([]);
//   const [message, setMessage] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(true); // Индикатор загрузки

//   const searchParams = useSearchParams();
//   const statusFilter = searchParams.get('status'); // Получаем фильтр статуса из URL

//   // Фильтрация задач по статусу
//   const filterTasksByStatus = (tasks: any[]) => {
//     if (!statusFilter) return tasks; // Если фильтр не задан, показываем все задачи
//     return tasks.filter(task => task.status === statusFilter);
//   };

//   // Функция получения задач
//   const fetchTasks = useCallback(async () => {
//     setLoading(true); // Начинаем загрузку
//     try {
//       const response = await fetch(`/api/tasks`);
//       const data = await response.json();

//       if (data.message) {
//         setMessage(data.message);
//       } else {
//         setTasks(data);
//       }
//     } catch (error) {
//       console.log(error);
//       setMessage('Произошла ошибка при загрузке задач');
//     } finally {
//       setLoading(false); // Завершаем загрузку
//     }
//   }, [managerId]);

//   useEffect(() => {
//     fetchTasks();
//   }, [fetchTasks]);

//   // Функция для обновления статуса задачи
//   const handleStatusChange = async (taskId: string, newStatus: string) => {
//     try {
//       const response = await fetch(`/api/tasks/${taskId}`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ status: newStatus }),
//       });

//       if (response.ok) {
//         // Обновить статус задачи в состоянии
//         setTasks(prevTasks =>
//           prevTasks.map(task =>
//             task._id === taskId ? { ...task, status: newStatus } : task
//           )
//         );
//       }
//     } catch (error) {
//       console.error('Error updating status:', error);
//     }
//   };

//   const filteredTasks = filterTasksByStatus(tasks); 

//   return (
//     <div className="m-5">
//       {loading ? (
//         <p>Загрузка...</p> 
//       ) : message ? (
//         <p>{message}</p>
//       ) : (
//         <Table>
//           <TableHead>
//             <TableRow className="grid grid-cols-12 gap-2 ">
//               <TableHead className="font-bold">Назначил</TableHead>
//               <TableHead className="font-bold ">Ответственный</TableHead>
//               <TableHead className="font-bold col-span-3 text-center">Задача</TableHead>
//               <TableHead className="font-bold col-span-2">Имя</TableHead>
//               <TableHead className="font-bold">Кому назначил</TableHead>
//               <TableHead className="font-bold">Этап</TableHead>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {Array.isArray(filteredTasks) && filteredTasks.map((task: any, index: any) => (
//               <TableRow key={index} className="grid grid-cols-12 gap-2">
//                 <TableCell>{task?.appointed?.name}</TableCell>
//                 <TableCell>{task?.assignedTo?.name}</TableCell>
//                 <TableCell className="col-span-3">{task?.taskName}</TableCell>
//                 <TableCell className="col-span-2">{task?.candidate?.name}</TableCell>
//                 <TableCell>{task?.assignedTo?.name}</TableCell>
//                 <TableCell className="col-span-2">
//                   <Select
//                     id={task._id}
//                     name="status"
//                     placeholder="Статус выполнения"
//                     defaultValue={task?.status}
//                     options={taskStats}
//                     onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
//                       handleStatusChange(task._id, e.target.value)
//                     }
//                   />
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       )}
//     </div>
//   );
// }
'use client';

import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import Select from "../inputs/Select/Select";
import { taskStats } from "@/src/config/constants";
import { useSearchParams } from 'next/navigation'; // Для фильтрации через параметры URL

export default function AllTasks() {
  const { data: session } = useSession();
  const managerId = session?.managerId;
  const userRole = session?.managerRole;  // Роль пользователя: админ или менеджер
  const [tasks, setTasks] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Индикатор загрузки

  const searchParams = useSearchParams();
  const statusFilter = searchParams.get('status'); // Получаем фильтр статуса из URL

  // Фильтрация задач по статусу
  const filterTasksByStatus = (tasks: any[]) => {
    if (!statusFilter) return tasks; // Если фильтр не задан, показываем все задачи
    return tasks.filter(task => task.status === statusFilter);
  };

  // Функция получения задач
  const fetchTasks = useCallback(async () => {
    setLoading(true); // Начинаем загрузку
    try {
      let url = "/api/tasks";  // URL по умолчанию для администратора

      // Если пользователь менеджер, запросим только его задачи
      if (userRole === "manager" && managerId) {
        url = `/api/tasks/${managerId}/forManager`; // URL для менеджера
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.message) {
        setMessage(data.message);
      } else {
        setTasks(data);
      }
    } catch (error) {
      console.log(error);
      setMessage('Произошла ошибка при загрузке задач');
    } finally {
      setLoading(false); // Завершаем загрузку
    }
  }, [managerId, userRole]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task._id === taskId ? { ...task, status: newStatus } : task
          )
        );
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredTasks = filterTasksByStatus(tasks); 

  return (
    <div className="m-5">
      {loading ? (
        <p>Загрузка...</p> 
      ) : message ? (
        <p>{message}</p>
      ) : (
        <Table>
          <TableHead>
            <TableRow className="grid grid-cols-12 gap-2 ">
              <TableHead className="font-bold">Назначил</TableHead>
              <TableHead className="font-bold ">Ответственный</TableHead>
              <TableHead className="font-bold col-span-3 text-center">Задача</TableHead>
              <TableHead className="font-bold col-span-2">Имя</TableHead>
              <TableHead className="font-bold">Кому назначил</TableHead>
              <TableHead className="font-bold">Этап</TableHead>
            </TableRow>
          </TableHead>

          <TableBody>
            {Array.isArray(filteredTasks) && filteredTasks.map((task: any, index: any) => (
              <TableRow key={index} className="grid grid-cols-12 gap-2">
                <TableCell>{task?.appointed?.name}</TableCell>
                <TableCell>{task?.assignedTo?.name}</TableCell>
                <TableCell className="col-span-3">{task?.taskName}</TableCell>
                <TableCell className="col-span-2">{task?.candidate?.name}</TableCell>
                <TableCell>{task?.assignedTo?.name}</TableCell>
                <TableCell className="col-span-2">
                  <Select
                    id={task._id}
                    name="status"
                    placeholder="Статус выполнения"
                    defaultValue={task?.status}
                    options={taskStats}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      handleStatusChange(task._id, e.target.value)
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
