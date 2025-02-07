// import { Card, CardHeader, CardTitle } from "@/components/ui/card";


// export const CandidatesInWork = () => {

//     return (
//         <><Card>
//             <CardHeader>
//                 <CardTitle>Общее количество кандидатов </CardTitle>
//             </CardHeader>
//         </Card><Card>
//                 <CardHeader>
//                     <CardTitle>Этапы</CardTitle>
//                 </CardHeader>
//                 <div className="grid grid-cols-5 gap-4 ">
//                     <CardHeader>
//                         <CardTitle>Не обработан</CardTitle>
//                     </CardHeader>
//                     <CardHeader>
//                         <CardTitle>На стадии рекрутинга</CardTitle>
//                     </CardHeader>
//                     <CardHeader>
//                         <CardTitle>Обработан куратором</CardTitle>
//                     </CardHeader>
//                     <CardHeader>
//                         <CardTitle>Обработан партнёром</CardTitle>
//                     </CardHeader>
//                     <CardHeader>
//                         <CardTitle>На обьекте</CardTitle>
//                     </CardHeader>
//                 </div>
//             </Card></>
//     );
// };
'use client'
import React, { useState } from "react";
import DateRangePicker from "@/src/components/CandidatesInWork/DateRangePicker";
import { Candidate } from "@/src/types/candidate"; // Тип кандидата
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import {  ru } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from "@/components/ui/hover-card"
import { CalendarIcon, Minus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
const CandidatesInWork = () => {
    const [candidates, setCandidates] = useState<Candidate[]>([]);

    const fetchCandidates = async (startDate: Date | null, endDate: Date | null) => {
        try {
            const response = await fetch(
                `/api/candidates/getAll?startDate=${startDate?.toISOString() || ""}&endDate=${endDate?.toISOString() || ""}`
            );
            const data = await response.json();
            setCandidates(data.candidates); // Устанавливаем полученные данные в состояние
        } catch (error) {
            console.error("Error fetching candidates:", error);
        }
    };

    return (
        <div>
            <DateRangePicker onFilter={fetchCandidates} />
            <div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow className="grid grid-cols-12 gap-2 ">
                                <TableHead className="font-bold col-span-4">Имя</TableHead>
                                <TableHead className="font-bold flex justify-center col-span-2">Рекрутер</TableHead>
                                <TableHead className="font-bold flex justify-center col-span-2">Куратор</TableHead>
                                <TableHead className="font-bold flex justify-center col-span-2">Партнёр</TableHead>
                                <TableHead className="font-bold flex justify-center col-span-2">Объект</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {candidates.length > 0 ? (
                                candidates.map((candidate, index) => {
                                    return (
                                        <TableRow key={index} className="grid grid-cols-12 gap-2">
                                            <TableCell className="col-span-4 flex justify-start">
                                                <span>{candidate.name}</span>
                                                <div>
                                                    <Badge className="text-red-800">Добавлен {candidate.createdAt ? formatDistanceToNow(new Date(candidate.createdAt), { addSuffix: true, locale: ru }) : "Дата не указана"}</Badge>
                                                    
                                                    
                                                </div>
                                            </TableCell>
                                            <TableCell className="col-span-2 flex justify-center">
                                                    {candidate?.stages?.stage === "recruiter" && (
                                                        <Badge className="bg-green-800">
 <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@nextjs</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src="https://github.com/vercel.png" />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@nextjs</h4>
            <p className="text-sm">
              The React Framework – created and maintained by @vercel.
            </p>
            <div className="flex items-center pt-2">
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">
                Joined December 2021
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>                                                        </Badge>)}
                                                       
                                            </TableCell>
                                            <TableCell className="col-span-2 flex justify-center">
                                                    {candidate?.stages?.stage === "curator" && (
                                                        <Badge className="bg-green-800 w-sm">
 <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link" className="text-white">Передан куратору</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
          <div className="flex flex-col justify-start items-start">
            <h4 className="text-sm font-semibold ">{candidate.manager && candidate.manager.name}</h4>
            <p className="text-sm">
              {candidate.stages && candidate.stages.comment}
            </p>
            <div className="flex items-center pt-2">
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">
              {candidate.stages && candidate.stages.createdAt ? formatDistanceToNow(new Date(candidate.createdAt), { addSuffix: true, locale: ru }) : "Дата не указана"}
              </span>
            </div>
            {candidate.stages && candidate.stages.tasks && candidate.stages.tasks.map((task:any, index: any) => (
              <div key={index} className="flex items-center pt-2">
                <Minus className="mr-2 h-4 w-4 opacity-70" />{" "}
                <span className="text-xs text-muted-foreground">
                  {task.taskName}
                </span>
              </div>
            ))}
          </div>
      </HoverCardContent>
    </HoverCard>                                                        </Badge>)}
                                                       
                                            </TableCell>
                                            <TableCell className="col-span-2 flex justify-center">
                                                {candidate?.stages?.stage === "partner" && (
                                                    <Badge className="bg-green-800">
                                                        Передан партнёру
                                                    </Badge>
                                                )}
                                            </TableCell>

                                            <TableCell className="col-span-2 flex justify-center">
                                                {candidate?.stages?.stage === "object" && (
                                                    <Badge className="bg-green-800">
                                                        На обьекте
                                                    </Badge>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell className="h-24 text-center" colSpan={6}>
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

        </div>
    );
};

export default CandidatesInWork;
