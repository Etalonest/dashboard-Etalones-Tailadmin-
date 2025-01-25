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
import { useManagers } from "@/src/context/ManagersContext";


  export function CandidateTab() {
const { data: session } = useSession();
if (session?.managerRole === 'admin') {

  const { managers } = useManagers();
    return (
      <Table>
        <TableCaption className="font-bold text-center ">
        
                      
          </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Имя менеджера</TableHead>
            <TableHead className="text-center">Партнёры</TableHead>
            <TableHead className="text-center">Кандидаты</TableHead>
            <TableHead className="text-right">Статус</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {managers.map((manager: any) => (
            <TableRow key={manager.name}>
              <TableCell className="text-start">{manager.name}</TableCell>
              <TableCell className="text-center">Партнёр</TableCell>
              <TableCell className="text-center">Кандидаты</TableCell>
              <TableCell className="text-center">Статус</TableCell>
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