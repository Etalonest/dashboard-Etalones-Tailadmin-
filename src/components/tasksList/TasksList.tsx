'use client';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { da } from "date-fns/locale";
import { useEffect, useState } from "react";
export default function TasksList() {

    const [tasks, setTasks] = useState<any[]>([]);
    useEffect(() => {
        const fetchTasks = async () => {
          try {
            const response = await fetch("/api/tasks"); 
            if (!response.ok) {
              throw new Error("Ошибка при загрузке задач");
            }
            const data = await response.json();
            setTasks(data);
          } catch (error: any) {
            console.log(error);
          } 
        };
        fetchTasks();
      }, []);
      console.log("TASK", tasks)
    return (
        <Table className="m-5">
            <TableHead>
                <TableHeader>
                    <TableRow className="grid grid-cols-11 gap-2 ">
                        <TableHead className="font-bold">Назначил</TableHead>
                        <TableHead className="font-bold col-span-3">Задача</TableHead>
                        <TableHead className="font-bold col-span-2">Имя</TableHead>
                        <TableHead className="font-bold">Этап</TableHead>
                        {/* <TableHead className="font-bold col-span-2">Последне события</TableHead>
                        <TableHead className=" font-bold ">Результат</TableHead> */}
                        <TableHead className=" font-bold"></TableHead>
                    </TableRow>
                    <TableBody>
                    {tasks.map((task: any, index: any) => (
                       <TableRow key={index} className="grid grid-cols-11 gap-2 ">
                        <TableCell>{task?.assignedTo.name}</TableCell>
                        <TableCell className="col-span-3">{task?.taskName}</TableCell>
                        <TableCell className="col-span-2">{task?.candidate.name}</TableCell>
                        <TableCell>{task?.stage.status}</TableCell>
                        {/* <TableCell className="col-span-2">1</TableCell>
                        <TableCell >1</TableCell> */}
                        <TableCell><Button>Сохранить изменения</Button></TableCell>
                        </TableRow>
                        ))} 
                    </TableBody>       
                    </TableHeader>
            </TableHead>
        </Table>
    );
}


