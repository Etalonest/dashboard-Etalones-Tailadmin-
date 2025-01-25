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
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, TrendingUp } from "lucide-react";


  export function RecruiterTab() {
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
            <TableHead className="text-center">Обработаные Кандидаты </TableHead>
            <TableHead className="text-center">Переданые Кандидаты</TableHead>
            <TableHead className="text-center">Статус</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {managers.map((manager: any) => (
            <TableRow key={manager.name} >
              <TableCell className="text-start">{manager.name}</TableCell>
              <TableCell className="text-center">
              <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
        <div className="flex justify-center gap-2">   
              <Badge>+5</Badge>
                <TrendingUp color="green"/>
                </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-white p-1 border-2 rounded-md w-full max-w-xs">
          <p>Add to libraryAdd to libraryAdd to libraryAdd to libraryAdd to libraryAdd to library</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
                
              </TableCell>
              <TableCell className="text-center">
              <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex justify-center gap-2">   
              <Badge >-2</Badge>
              <TrendingDown color="red"/>
              </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-white p-1 border-2 rounded-md w-full max-w-xs">
          <p>Add to libraryAdd to libraryAdd to libraryAdd to libraryAdd to libraryAdd to library</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
              
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center">
                В работе с &nbsp;<Link href={'#'} className="underline">партнёром</Link>
                </div>
                </TableCell>
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