'use client'
import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react"; // иконка календаря
import { Button } from "@/components/ui/button"; // кнопка из вашей библиотеки
import { Calendar } from "@/components/ui/calendar"; // календарь из вашей библиотеки
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; // popover для отображения календаря
import { cn } from "@/lib/utils"; // ваша утилита для объединения классов
import { ru } from "date-fns/locale"; // импортируем русскую локаль

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP", { locale: ru }) : <span>Выберите дату</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value || undefined}
          onSelect={onChange as any}
          initialFocus
          locale={ru}  
        />
      </PopoverContent>
    </Popover>
  );
};
