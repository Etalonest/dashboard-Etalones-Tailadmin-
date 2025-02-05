'use client'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
 import {Button} from "@/components/ui/button";
 import { useSession } from "next-auth/react";
import { DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenu } from "@/components/ui/dropdown-menu";
import { useManager } from "@/src/context/ManagerContext";
import { useCandidates } from '@/src/context/CandidatesContext';

  export function CandidateTab() {
const { data: session } = useSession();
const { manager } = useManager();
const { candidates, isLoading, error } = useCandidates();
// console.log("test!!!", candidates[0]?.stages.comment)
if (session?.managerRole && ['recruiter', 'manager', 'admin'].includes(session.managerRole)) {

    return (
      <Table>
        <TableCaption className="font-bold text-center ">
                      
          </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Имя кандидата</TableHead>
            <TableHead className="text-center">Партнёры</TableHead>
            <TableHead className="text-center">Кандидаты</TableHead>
            <TableHead className="text-right">Статус</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {manager?.candidates && candidates.map((candidates, index) => (
            <TableRow key={index}>
              <TableCell className="text-start">{candidates.name}</TableCell>
              <TableCell className="text-center">{candidates.phone}</TableCell>
              <TableCell className="text-center">Кандидаты</TableCell>
              <TableCell className="text-center">{candidates?.stages?.comment}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                <DropdownMenuTrigger><Button ><span>Подробнее</span></Button></DropdownMenuTrigger>
                <DropdownMenuContent>
    <DropdownMenuLabel>{manager.name}</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Профиль</DropdownMenuItem>
    <DropdownMenuItem>Партнёры</DropdownMenuItem>
    <DropdownMenuItem>Кандидаты</DropdownMenuItem>
    <DropdownMenuItem className="success">Удалить</DropdownMenuItem>
  </DropdownMenuContent>
                </DropdownMenu>
                </TableCell>
            </TableRow>
          ))}
        </TableBody>
        
      </Table>
    )
  }
}