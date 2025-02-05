"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AllCandidatesProvider, useCandidates } from '@/src/context/AllCandidatesContext';

export function CandidateTable() {
  const { candidates, isLoading, error } = useCandidates();

  return (
      <div className="w-full">
        <div className="flex items-center py-4">
          <Input placeholder="Filter emails..." className="max-w-sm" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem>column.id</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="grid grid-cols-6 gap-2 ">
                <TableHead className="font-bold">Имя</TableHead>
                <TableHead className="font-bold">Ответственный</TableHead>
                <TableHead className="font-bold">Этап</TableHead>
                <TableHead className="font-bold col-span-2">Последне события</TableHead>
                <TableHead className="flex justify-end font-bold">Результат</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.length > 0 ? (
                candidates.map((candidate, index) => {
                  return (
                    <TableRow key={index} className="grid grid-cols-6 gap-2">
                      <TableCell className="flex justify-start">
                        <span>{candidate.name}</span>
                      </TableCell>
                      <TableCell className="flex justify-start">
                        <span>{candidate?.manager?.name || 'Нет ответственного'}</span>
                      </TableCell>
                      <TableCell className="flex justify-start">
                      <Badge
  className={
    candidate?.stages?.stage === "recruiter"
      ? "text-green-800 bg-slate-100" // Если этап рекрутера
      : candidate?.stages?.stage 
      ? "text-slate-800 bg-slate-100" // Для других этапов
      : "text-red-700 bg-slate-100"   // Если этапа нет
  }
>
  {candidate?.stages?.stage === "recruiter"
    ? "Рекрутируется"
    : candidate?.stages?.stage
    ? candidate?.stages?.stage // Если есть другой этап
    : "Нет этапа"}  {/* Если нет этапа */}
</Badge>
                      </TableCell>
                      <TableCell className=" text-start col-span-2">
                        <span>{candidate?.stages?.comment}</span> 
                        {candidate?.stages && <Badge className="text-green-800 ">
                            {candidate?.stages?.createdAt.slice(0, 10)}
                          </Badge>}
                      </TableCell>
                      <TableCell className="flex justify-end">
                        <span>{candidate?.stages?.status || 'Нет статуса'}</span>
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
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex justify-start">
            <span className="text-muted-foreground text-sm">Выбрана 2 стр. из 10</span>
          </div>
          <div className="space-x-2">
            <Button variant="outline" size="sm">
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>
  );
}
