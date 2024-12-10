"use client";
import React, { useState } from "react";

// Обновляем интерфейс, чтобы принимать список опций
interface SelectProps {
  label: string;
  placeholder?: string;
  type?: string;
  id: string;
  options: { value: string; label: string }[]; // Массив объектов с value и label
  [x: string]: any; // Для дополнительных свойств
}

const Select: React.FC<SelectProps> = ({
  label,
  placeholder = "Введите значение",
  type = "text",
  id,
  options, // Получаем опции через пропсы
  ...rest
}) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);

  const changeTextColor = () => {
    setIsOptionSelected(true);
  };

  return (
    <div className="flex flex-col space-y-1">
      <label className="block text-sm font-medium text-black dark:text-white">
        {label}
      </label>

      <div className="relative  z-20 bg-transparent ">
        <select
          value={selectedOption}
          onChange={(e) => {
            setSelectedOption(e.target.value);
            changeTextColor();
          }}
          className={`w-[250px]  text-sm border-stroke rounded-lg border-[1.5px]  bg-transparent px-5 py-1 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
            isOptionSelected ? "text-black dark:text-white" : ""
          }`}
          {...rest}
        >
          <option value="" disabled className="text-body dark:text-bodydark">
            {placeholder} {/* Добавляем placeholder */}
          </option>
          {/* Отображаем все опции, переданные через пропс options */}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="text-body dark:text-bodydark"
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
