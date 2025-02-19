'use client'

import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {  useEffect, useState } from "react";

export default function FromRecruiter() {

const [stageData, setStageData] = useState<any[]>([]);

useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/stages', {
          headers: {
            'Cache-Control': 'no-cache',  // предотвращаем кэширование
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch stages');
        }
  
        const data = await response.json();
        console.log(data);  
  
        const sortedData = data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
        setStageData(sortedData);  // Сохраняем отсортированные события
      } catch (error) {
        console.error(error);
      } 
    };
  
    fetchData();
  }, []);  
  
  return (
    <>
      <div className="">
        <Table>
            <TableHeader>
                <TableRow className="grid grid-cols-9 gap-2">
                    <TableHead className="font-bold">Рекрутер</TableHead>
                    <TableHead className="font-bold">Имя кандидата</TableHead>
                    <TableHead className="font-bold col-span-4">Комментарий</TableHead>
                    <TableHead className="font-bold col-span-2">Дата</TableHead>
                    <TableHead className="font-bold">Вакансия</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {stageData.map((item, index) => (
                    <TableRow key={index} className="grid grid-cols-9 gap-2">
                        <TableCell className="font-bold">
                            {item?.appointed?.name}
                        </TableCell>
                        <TableCell className="font-bold">
                            {item.candidate?.name}
                        </TableCell>
                        <TableCell className="font-bold col-span-4">
                            {item.comment}
                        </TableCell>
                        <TableCell className="text-sm col-span-2">
                            <Badge >
                        {`${new Date(item.createdAt).toLocaleDateString('ru-RU', {
                  day: '2-digit', month: 'long', year: '2-digit'
                })}`}</Badge>
                        </TableCell>
                        <TableCell className="font-bold">
                            {item.vacancy?.title}
                            <Badge>
                                {item.vacancy?.location}
                            </Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        
      </div>
    </>
  );
}