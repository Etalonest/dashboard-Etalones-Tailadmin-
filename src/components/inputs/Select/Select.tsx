"use client";
import React, { useEffect, useState } from "react";

// Обновляем интерфейс, чтобы принимать список опций
interface SelectProps {
  defaultValue?: string;
  label: string;
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

      <div className="relative  z-20 bg-transparent ">
        <select
          value={selectedOption}
          onChange={(e) => {
            setSelectedOption(e.target.value);
            changeTextColor();
          }}
          className={`w-[250px]  text-sm text-black-2 dark:text-white border-stroke rounded-lg border-[1.5px]  bg-transparent px-5 py-1  outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
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
