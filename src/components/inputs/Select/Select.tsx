"use client";
import React, { useEffect, useState } from "react";

// Обновляем интерфейс, чтобы принимать список опций
interface SelectProps {
  defaultValue?: string;
  label?: string;
  placeholder?: string;
  type?: string;
  id: string;
  options: { value: string; label: string }[]; // Массив объектов с value и label
  [x: string]: any; // Для дополнительных свойств
}

const Select: React.FC<SelectProps> = ({
  defaultValue = '',
  label,
  placeholder = "Введите значение",
  type = "text",
  id,
  options, // Получаем опции через пропсы
  ...rest
}) => {
const [selectedOption, setSelectedOption] = useState<string>(defaultValue);
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
  useEffect(() => {
    setSelectedOption(defaultValue);
  }, [defaultValue]);
  const changeTextColor = () => {
    setIsOptionSelected(true);
  };

  return (
    <div className="flex flex-col space-y-1">
      <label className="block text-sm font-medium text-black-2 dark:text-white">
        {label}
      </label>

      <div className="bg-transparent ">
        <select
          value={selectedOption}
          onChange={(e) => {
            setSelectedOption(e.target.value);
            changeTextColor();
          }}
          className={`flex h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-neutral-800 dark:file:text-neutral-50 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300 ${
            isOptionSelected ? "text-black-2 dark:text-white" : ""
          }`}
          {...rest}
        >
          <option value="" disabled className="text-black dark:text-bodydark">
            {placeholder} {/* Добавляем placeholder */}
          </option>
          {/* Отображаем все опции, переданные через пропс options */}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="text-black dark:text-white"
            >
              {option.label}
            </option>
          ))}
        </select>

      </div>
    </div>
  );
};

export default Select;
