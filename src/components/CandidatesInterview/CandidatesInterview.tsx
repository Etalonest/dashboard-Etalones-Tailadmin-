'use client'
import React, { useState, useEffect } from "react";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Candidate } from "@/src/types/candidate";
import SidebarRight from "@/src/components/SidebarRight";
import { useSidebarR } from "@/src/context/SidebarRContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DrawerBody } from "@/src/components/Drawer/DrawerBody/DrawerBodyToInterviewRes";
import { useSession } from "@/src/context/SessionContext";
import { VacancyType } from "@/src/types/vacancy";
import { set } from "mongoose";
import { ca } from "date-fns/locale";
export default function CandidatesInterview({ data }: { data: Candidate[] }) {
  const { session } = useSession();
  const { toast } = useToast()
  const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [candidateIdToDelete, setCandidateIdToDelete] = useState<string | null>(null);
  const {
        setSidebarROpen,
        setFormType,
        setSelectedCandidate,
        setSelectedVacancy,
      } = useSidebarR();
      const openDialog = (id: string) => {
        setCandidateIdToDelete(id);
        setIsDialogOpen(true);
      };
    
      const closeDialog = () => {
        setIsDialogOpen(false);
        setCandidateIdToDelete(null);
      };
  
      useEffect(() => {
        console.log('SelectedVacancy has been updated:', setSelectedVacancy);
    }, [setSelectedVacancy]);
    
    useEffect(() => {
        console.log('SelectedCandidate has been updated:', setSelectedCandidate);
    }, [setSelectedCandidate]);
    
  const handleDelete = async () => {
    if (!candidateIdToDelete) return; // Если нет кандидата для удаления, выходим из функции

    setLoading(true);
    setError(null);

    try {
      // Отправляем запрос на удаление кандидата
      const response = await fetch(`/api/testApi/${candidateIdToDelete}/dellete`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        toast({
            title: "Кандидат успешно перемещён в \"Удалённые\"",
            description: "Для просмотра кандидатов перейдите в раздел \"Кандидаты\"",
            duration: 5000,
          })
        // Обновление списка кандидатов или другая логика, например, удаление из состояния
      } else {
        setError(data.error || 'Неизвестная ошибка');
      }
    } catch (err) {
      console.error('Ошибка при удалении кандидата:', err);
      setError('Ошибка при удалении кандидата');
    } finally {
      setLoading(false);
      closeDialog();  // Закрываем диалог после выполнения операции
    }
  };

  const columns: ColumnDef<Candidate>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Имя
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => <div className="font-semibold">{row.getValue("name")}</div>,
      },
    {
        accessorKey: "manager",  // Здесь имя поля может быть любое, но мы не будем использовать его для отображения
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Последнее событие
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => {
          const candidate = row.original; // Получаем данные кандидата
          const events = candidate?.events; // Проверяем, есть ли событие у кандидата
      
          let eventType = "Нет событий"; // Устанавливаем дефолтное значение
      
          if (Array.isArray(events) && events.length > 0) {
            // Если массив событий есть и он не пустой
            const lastEvent = events[events.length - 1]; // Получаем последнее событие
            eventType = lastEvent?.eventType || "Не указан тип события"; // Если eventType отсутствует, показываем дефолтное значение
          }
      
          return <div className="">{eventType}</div>;
        },
      },      
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Дата
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => {
          const candidate = row.original; // Получаем данные кандидата
          const events = candidate?.events; // Проверяем, есть ли события у кандидата
      
          let eventCreatedAt = "Нет событий"; // Устанавливаем дефолтное значение
      
          if (Array.isArray(events) && events.length > 0) {
            // Если массив событий есть и он не пустой
            const lastEvent = events[events.length - 1]; // Получаем последнее событие
            eventCreatedAt = lastEvent?.createdAt || "Дата не указана"; // Если createdAt отсутствует, показываем дефолтное значение
          }
      
          const formattedDate = new Date(eventCreatedAt).toLocaleString().slice(0, 10); // Форматируем дату
          return <div className="lowercase">{formattedDate}</div>;
        },
      },                    
      {
        accessorKey: "vacancy",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Вакансия
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => {
          const candidate = row.original; 
          const events = candidate?.events;
      
          let eventVacancy = "Нет вакансии"; 
          let eventVacancyLocation = "Нет места"; 
      
          if (Array.isArray(events) && events.length > 0) {
            const lastEvent = events[0]; 
            if (lastEvent?.vacancy) {
              eventVacancy = lastEvent.vacancy?.title || "Вакансия не указана";
              eventVacancyLocation = lastEvent.vacancy?.location || "Место не указано";
            }
          }
      
          return <div className="">{eventVacancy}-{eventVacancyLocation}</div>;
        },
      },
      
    {
        accessorKey: "eventComment",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Комментарий
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => {
            const candidate = row.original; 
            const events = candidate?.events;
        
            let eventComment = "Нет комментария"; 
            if (Array.isArray(events) && events.length > 0) {
                const lastEvent = events[events.length - 1]; 
                eventComment = lastEvent?.comment || "Комментарий не указан"; 
            }
              return (
                <div>
                  {eventComment}
                </div>
              );
          },
          
      },      
      {
        accessorKey: "statusWork",  // или любой другой ключ для статусов
        header: "Status",  // Заголовок для этой колонки
        cell: ({ row }) => {
          const statuses = row.getValue("statusWork");  // Получаем статус
      
          // Проверяем, что это массив
          if (Array.isArray(statuses)) {
            return (
              <TableCell>
                {statuses.map((status: { name: string }) => status.name).join(', ')} {/* Отображаем статусы через запятую */}
              </TableCell>
            );
          }
      
          return <TableCell>-</TableCell>;  // Если это не массив, возвращаем дефолтное значение
        },
      },
      {
        accessorKey: "documents",
        header: "Документы",  // Заголовок
        cell: ({ row }) => {
          const documents = row.getValue("documents");  // Получаем список документов
      
          // Проверяем, что это массив
          if (Array.isArray(documents)) {
            if (documents.length > 0) {
              // Если массив не пустой, отображаем типы документов через запятую
              return (
                <TableCell>
                  {documents.map((document: { docType: string }) => document.docType).join(", ")}
                </TableCell>
              );
            } else {
              // Если массив пустой
              return <TableCell>Документы не указаны</TableCell>;
            }
          } else {
            // Если documents не массив
            return <TableCell>Документы не указаны</TableCell>;
          }
        },
      },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const candidate = row.original;
        return (
          <Drawer>     
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Действия</DropdownMenuLabel>
              <DropdownMenuItem
            onClick={() => {
              if (candidate._id) {
                navigator.clipboard.writeText(candidate._id);  
              } else {
                console.error("Candidate ID is missing");
              }
            }}
          >
  <DrawerTrigger asChild>
        <div >Результат собеседования</div>
      </DrawerTrigger>
</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => toggleSidebar("viewCandidate", candidate)} >Посмотреть кандидата</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => toggleSidebar("viewVacancy", candidate?.events[0]?.vacancy)} >Посмотреть вакансию</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => toggleSidebar("editCandidate", candidate)} >Редактировать</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
    if (candidate._id) {
      openDialog(candidate._id);  
    } else {
      console.error("Candidate ID is missing");
    }
  }} >Удалить</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DrawerContent>
          <DrawerHeader>
            <DrawerTitle><p>Выберите результат собеседования по вакансии &quot;{candidate?.events[0]?.vacancy?.title}&quot; для кандидптп {candidate.name}?</p></DrawerTitle>
            <DrawerDescription>Город зарплата</DrawerDescription>
          </DrawerHeader>
          <DrawerBody candidate={candidate} managerId={session?.managerId} vacancy={candidate?.events[0]?.vacancy} />
          <DrawerFooter >
            <DrawerClose asChild>
              <Button variant="outline">Отмена</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
          </Drawer>
        );
      },
    },
  ];

  // Настройки таблицы с использованием useReactTable
  const table = useReactTable({
    data: data, 
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  const toggleSidebar = (type: 'addCandidate' | 'editCandidate' | 'viewCandidate' | 'viewVacancy', candidate?: Candidate, ) => {
    setFormType(type);
    const selectedVacancy =  candidate?.events[0].vacancy as VacancyType;
    setSelectedVacancy(selectedVacancy);
    setSelectedCandidate(candidate || null);
    setSidebarROpen(true);
};

  return (
    <div className="w-full">
        <SidebarRight/>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
       
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
        <DialogContent className="w-[800px] p-4 flex flex-col justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <DialogHeader>
            <DialogTitle>Вы уверены?</DialogTitle>
            <DialogDescription className="w-2/3 text-start p-5">
              Это действие нельзя будет отменить. Вы уверены, что хотите удалить этого кандидата?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button variant="outline"  onClick={closeDialog}>Отмена</Button>
            <Button type="submit" className="bg-red-500 text-white" onClick={handleDelete} disabled={loading}>
              {loading ? "Удаление..." : "Подтвердить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
     
    </div>
  );
}
