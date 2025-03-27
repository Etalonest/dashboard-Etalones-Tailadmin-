'use client'
import React, { useState, useEffect } from "react";
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
import { Candidate } from "@/src/types/candidate"; // Убедитесь, что типы кандидатов правильно указаны
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

export default function TestPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]); // Состояние для кандидатов
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stageId, setStageId] = useState<string>(process.env.NEXT_PUBLIC_STAGE_ALL_CANDIDATES || "");

  // Обработчик изменения выбора стадии
  const handleStageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStageId(event.target.value); // Обновляем состояние stageId
  };
  const handleDelete = async (id: string) => {
    setLoading(true);
    setError(null);
  
    try {
      // Отправляем запрос на удаление кандидата по его id
      const response = await fetch(`/api/testApi/${id}/dellete`, {
        method: 'POST',
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Успешное удаление, можно обновить UI или уведомить пользователя
        alert('Кандидат успешно перемещён в "Удалённые"');
        // Здесь можно добавить логику обновления списка кандидатов (например, удалив его из состояния)
      } else {
        setError(data.error || 'Неизвестная ошибка');
      }
    } catch (err) {
      console.error('Ошибка при удалении кандидата:', err);
      setError('Ошибка при удалении кандидата');
    } finally {
      setLoading(false);
    }
  };
  
  // Функция для загрузки кандидатов по stageId
  const fetchCandidates = async () => {
    try {
      const response = await fetch(`/api/testApi/stages?stageId=${stageId}`);
      const data = await response.json();

      if (response.ok) {
        setCandidates(data);
      } else {
        setError("Ошибка при загрузке кандидатов");
      }
    } catch (err) {
      setError("Произошла ошибка при запросе");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchCandidates(); // Загружаем кандидатов при изменении stageId
  }, [stageId]);

  // Состояние для таблицы
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Структура колонок для таблицы
  const columns: ColumnDef<Candidate>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
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
              <DropdownMenuItem onClick={() => handleDelete(candidate._id || '')} disabled={loading}>Удалить</DropdownMenuItem>
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

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <select
          value={stageId}
          onChange={handleStageChange}
          className="ml-auto"
        >
          <option value={process.env.NEXT_PUBLIC_STAGE_ALL_CANDIDATES}>Все кандидаты</option>
          <option value={process.env.NEXT_PUBLIC_STAGE_NEW}>Новые</option>
          <option value={process.env.NEXT_PUBLIC_STAGE_IN_PROCESS}>В обработке</option>
          <option value={process.env.NEXT_PUBLIC_STAGE_ON_INTERVIEW}>На собеседовании</option>
          <option value={process.env.NEXT_PUBLIC_STAGE_INTERVIEW_SUCCESS}>Положительное собеседование</option>
          <option value={process.env.NEXT_PUBLIC_STAGE_ON_OBJECT}>На объекте</option>
        </select>
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
    </div>
  );
}
