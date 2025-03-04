'use client'
import React, { useState, useEffect } from "react";
import DateRangePicker from "@/src/components/CandidatesInWork/DateRangePicker";
import { Candidate } from "@/src/types/candidate"; // Тип кандидата
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { CalendarIcon, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Loader from "@/src/components/common/Loader";

const CandidatesInWork = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const fetchCandidates = async (startDate: Date | null, endDate: Date | null) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/candidates/toDate?startDate=${startDate?.toISOString() || ""}&endDate=${endDate?.toISOString() || ""}`
      );
      const data = await response.json();
      setCandidates(data.candidates);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const today = new Date();
    const last7Days = new Date(today);
    last7Days.setDate(today.getDate() - 7);  // Вычисляем дату 7 дней назад

    fetchCandidates(last7Days, today);  // Загружаем кандидатов за последние 7 дней
  }, []);  // Пустой массив зависимостей, чтобы выполнить один раз при монтировании

  return (
    <div>
      <DateRangePicker onFilter={fetchCandidates} />
      <div>
        {loading ? (
          <Loader />
        ) : (
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
                        </TableCell>
                        <TableCell className="col-span-2 flex justify-center">
                          {candidate?.stages?.stage === "recruiter" && (
                            <Badge className="bg-green-800">
                              <HoverCard>
                                <HoverCardTrigger asChild>
                                  <Button variant="link" className="text-white">{candidate?.manager?.name}</Button>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-80">
                                  <div>
                                    {candidate?.statusWork && candidate.statusWork.length > 0 ? (
                                      <>
                                        <p>Статус</p>
                                        {candidate.statusWork.map((status: any, index: number) => (
                                          <div key={index}>
                                            <span className="text-xs text-muted-foreground">
                                              {status.name}
                                            </span>
                                          </div>
                                        ))}
                                      </>
                                    ) : null}
                                  </div>

                                  <div>
                                    {candidate.comment.map((comment: any, index: number) => (
                                      <div key={index}>
                                        <span className="text-xs text-muted-foreground">
                                          {comment?.author?.name}: {comment?.text}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="flex items-center pt-2">
                                    <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                                    <span className="text-xs text-muted-foreground">
                                      Добавлен {candidate.createdAt ? formatDistanceToNow(new Date(candidate.createdAt), { addSuffix: true, locale: ru }) : "Дата не указана"}
                                    </span>
                                  </div>
                                </HoverCardContent>
                              </HoverCard>
                            </Badge>
                          )}
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
                                    {candidate.stages && candidate.stages.tasks && candidate.stages.tasks.map((task: any, index: any) => (
                                      <div key={index} className="flex items-center pt-2">
                                        {task.status === "выполнена" ? (
                                          <Check className="mr-2 h-4 w-4 opacity-70 text-green-800" />
                                        ) : (
                                          <X className="mr-2 h-4 w-4 opacity-70 text-red-800" />
                                        )}
                                        <span className="text-xs text-muted-foreground">
                                          {task.taskName}
                                        </span>
                                      </div>
                                    ))}
                                    <div>Ответственный куратор: <span className="text-green-800">{candidate.stages.responsible.name}</span></div>
                                  </div>
                                </HoverCardContent>
                              </HoverCard>
                            </Badge>
                          )}
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
        )}
      </div>
    </div>
  );
};

export default CandidatesInWork;
