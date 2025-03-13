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
 import { useSession } from "@/src/context/SessionContext";
import { Circle } from "lucide-react";
import { DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenu } from "@/components/ui/dropdown-menu";
 interface Manager {
  name: string;
  phone: string;
  email: string;
  // Другие поля менеджера
}

interface TableManagersProps {
  onClick: (type: "addCandidate" | "editCandidate" | "viewCandidate" | "createManager") => void;
  managers: Manager[]; // Типизация для массива менеджеров
}
  export function TableManagers({ managers, onClick }: TableManagersProps) {
const { session } = useSession();
if (session?.managerRole === 'admin') {

    return (
      <Table>
        <TableCaption className="font-bold text-center ">
          <div className="flex justify-between">
          <p className="text-xl">Список менеджеров </p> 
          <button className="text-md" onClick={() => onClick("createManager")}><Circle/>Создать менеджера</button>
          </div>
                      
          </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Имя менеджера</TableHead>
            <TableHead className="text-center">Статус</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {managers.map((manager: any) => (
            <TableRow key={manager.name}>
              <TableCell className="text-start">{manager.name}</TableCell>
              <TableCell className="text-center">{manager.phone}</TableCell>
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