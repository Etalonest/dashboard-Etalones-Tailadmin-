'use client';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useSession } from "@/src/context/SessionContext";
import Select from "../inputs/Select/Select";
import {  taskStats } from "@/src/config/constants";

export default function TasksList() {
  const { session } = useSession();
  const managerId = session?.managerId;
  const [tasks, setTasks] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`/api/tasks/${managerId}/forManager`); // Передаем managerId в запрос
        const data = await response.json();

        // Если пришло сообщение, отображаем его
        if (data.message) {
          setMessage(data.message);
        } else {
          setTasks(data); // иначе, если пришли задачи, заполняем массив
        }
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchTasks();
  }, [managerId]);
  return (
    <div className="m-5">
      {/* Если есть сообщение (например, "Нет задач"), выводим его */}
      {message ? (
        <p>{message}</p>
      ) : (
        <Table>
          <TableHead>
            <TableRow className="grid grid-cols-11 gap-2">
              <TableHead className="font-bold">Назначил</TableHead>
              <TableHead className="font-bold col-span-3">Задача</TableHead>
              <TableHead className="font-bold col-span-2">Имя</TableHead>
              <TableHead className="font-bold">Этап</TableHead>
              <TableHead className="font-bold"></TableHead>
            </TableRow>
          </TableHead>

          <TableBody>
            {Array.isArray(tasks) && tasks.map((task: any, index: any) => (
              <TableRow key={index} className="grid grid-cols-11 gap-2">
                <TableCell>{task?.appointed?.name}</TableCell>
                <TableCell className="col-span-3">{task?.taskName}</TableCell>
                <TableCell className="col-span-2">{task?.candidate?.name}</TableCell>
                <TableCell className="col-span-2">
                <Select  id="status" name="status" placeholder='Статус выполнения'
            defaultValue={task?.status}
            options={taskStats} />
                  </TableCell>
                <TableCell>
                  <Button>Сохранить изменения</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
