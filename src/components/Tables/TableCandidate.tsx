'use client'
import React, { useState, useEffect, use } from "react";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useManager } from "@/src/context/ManagerContext";

const TableCandidate = () => {
  const { manager } = useManager(); 
  const [candidates, setCandidates] = useState<(any)[]>([]); // Состояние для кандидатов
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});



  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [candidateIdToDelete, setCandidateIdToDelete] = useState<string | null>(null);
  const {
        setSidebarROpen,
        setFormType,
        setSelectedCandidate,
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
        if (manager && Array.isArray(manager.candidates)) {
          setCandidates(manager.candidates); // Обновляем состояние с кандидатами
        }
      }, [manager]);

  const handleDelete = async () => {
    if (!candidateIdToDelete) return; // Если нет кандидата для удаления, выходим из функции
    try {
      // Отправляем запрос на удаление кандидата
      const response = await fetch(`/api/testApi/${candidateIdToDelete}/dellete`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        alert('Кандидат успешно перемещён в "Удалённые"');
      } else {
console.log("Erroor");}
    } catch (err) {
      console.error('Ошибка при удалении кандидата:', err);
    } finally {
      closeDialog();  
    }
  };
  
 
  const columns: ColumnDef<Candidate>[] = [
    // {
    //   id: "select",
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value) => row.toggleSelected(!!value)}
    //       aria-label="Select row"
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
        accessorKey: "managerAndDate",
        header: "Менеджер и Дата",  // Название новой колонки
        cell: ({ row }) => {
          const manager = row.getValue("manager") as { name: string } | null;
          const createdAt = row.getValue("createdAt") as string;
          const formattedDate = new Date(createdAt).toLocaleString().slice(0, 10); // Обрезаем строку до первых 10 символов
      
          return (
            <div>
              <div>{manager ? `Менеджер: ${manager.name}` : "Менеджер: Нет"}</div>
              <div>Добавлен: {formattedDate}</div>
            </div>
          );
        },
      },
      
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Добавлен
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => {
            const createdAt = row.getValue("createdAt") as string;;
            const formattedDate = new Date(createdAt)
              .toLocaleString()
              .slice(0, 10); // Обрезаем строку до первых 10 символов
            return <div className="lowercase">{formattedDate}</div>;
          },
                },                 
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
    },
    {
        accessorKey: "phone",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Телефон
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => <div className="lowercase">{row.getValue("phone")}</div>,
      },
    {
        accessorKey: "professions",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Профессии
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => {
            const professions = row.getValue("professions");
          
            if (Array.isArray(professions)) {
              return (
                <div>
                  {professions.length > 0
                    ? professions.map((profession: { name: string }) => profession.name).join(", ")
                    : "Профессия не указана"}
                </div>
              );
            } else {
              return <div>No professions</div>;
            }
          },
          
      },      
      {
        accessorKey: "statusWork",  
        header: "Status",  
        cell: ({ row }) => {
          const statuses = row.getValue("statusWork");  
      
          
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
                navigator.clipboard.writeText(candidate._id);  // Копируем ID кандидата
              } else {
                console.error("Candidate ID is missing");
              }
            }}
          >
  Copy candidate ID
</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => toggleSidebar("viewCandidate", candidate)} >Посмотреть</DropdownMenuItem>
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
        );
      },
    },
  ];

  // Настройки таблицы с использованием useReactTable
  const table = useReactTable({
    data: candidates, 
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
 const toggleSidebar = (type: 'addCandidate' | 'editCandidate' | 'viewCandidate', candidate?: Candidate) => {
    setFormType(type);
    setSelectedCandidate(candidate || null);
    setSidebarROpen(true); // Открытие сайдбара
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
        <DialogContent className="w-[800px] p-4 flex flex-col justify-center items-center">
          <DialogHeader>
            <DialogTitle>Вы уверены?</DialogTitle>
            <DialogDescription className="text-start p-5">
              Это действие нельзя будет отменить. Вы уверены, что хотите удалить этого кандидата?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button variant="outline"  onClick={closeDialog}>Отмена</Button>
            <Button type="submit" className="bg-red-500 text-white" onClick={handleDelete} >
              {"Подтвердить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
      
    </div>
  );
};

export default TableCandidate;
