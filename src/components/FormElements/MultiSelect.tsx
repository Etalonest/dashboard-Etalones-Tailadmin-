
"use client";
import React, { useState, useEffect, useRef } from "react";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  label: string;
  placeholder?: string;
  id: string;
  options: Option[];
  [x: string]: any; // Для дополнительных свойств
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  placeholder = "Выберите значение",
  id,
  options,
  ...rest
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [show, setShow] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const trigger = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => setShow((prev) => !prev);

  const handleOptionToggle = (value: string) => {
    setSelectedOptions((prev) =>
      prev.includes(value)
        ? prev.filter((val) => val !== value)
        : [...prev, value]
    );
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      !trigger.current?.contains(event.target as Node)
    ) {
      setShow(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col space-y-1">
      <label className="block text-sm font-medium text-white">
        {label}
      </label>

      <div className="relative w-[250px] z-20 bg-transparent">
        <div
          ref={trigger}
          onClick={toggleDropdown}
          className="flex flex-col w-full"
        >
          <div className="relative flex rounded-lg border text-sm font-medium border-stroke   outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white">
            <div className="flex flex-wrap gap-3 px-5 py-1">
              {selectedOptions.length > 0 ? (
                selectedOptions.map((value) => {
                  const option = options.find((opt) => opt.value === value);
                  return (
                    option && (
                      <div
                        key={value}
                        className="  flex items-center justify-center rounded border-[0.5px] border-stroke bg-gray px-2.5 py-0.5 text-sm font-medium dark:border-strokedark dark:bg-white/30"
                      >
                        <div className="max-w-full flex-initial">{option.label}</div>
                        <div
                          onClick={() => handleOptionToggle(value)}
                          className="cursor-pointer pl-2 hover:text-danger"
                        >
                          <svg
                            className="fill-current"
                            role="button"
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M9.35355 3.35355C9.54882 3.15829 9.54882 2.84171 9.35355 2.64645C9.15829 2.45118 8.84171 2.45118 8.64645 2.64645L6 5.29289L3.35355 2.64645C3.15829 2.45118 2.84171 2.45118 2.64645 2.64645C2.45118 2.84171 2.45118 3.15829 2.64645 3.35355L5.29289 6L2.64645 8.64645C2.45118 8.84171 2.45118 9.15829 2.64645 9.35355C2.84171 9.54882 3.15829 9.54882 3.35355 9.35355L6 6.70711L8.64645 9.35355C8.84171 9.54882 9.15829 9.54882 9.35355 9.35355C9.54882 9.15829 9.54882 8.84171 9.35355 8.64645L6.70711 6L9.35355 3.35355Z"
                              fill="currentColor"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    )
                  );
                })
              ) : (
                <div className="flex-1">
                  <input
                    placeholder={placeholder}
                    className="h-full w-full appearance-none bg-transparent p-1 px-2 outline-none"
                    value=""
                  />
                </div>
              )}
            </div>
            <div className="flex w-8 items-center py-1 pl-1 pr-1">
              <button
                type="button"
                onClick={toggleDropdown}
                className="h-6 w-6 cursor-pointer outline-none focus:outline-none"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g opacity="0.8">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                      fill="#637381"
                    ></path>
                  </g>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Dropdown Menu */}
        <div
          ref={dropdownRef}
          className={`absolute left-0 top-full z-40 w-full max-h-64 overflow-y-auto rounded bg-white shadow dark:bg-form-input ${show ? "" : "hidden"}`}
        >
          <div className="flex flex-col">
            {options.map((option) => (
              <div
                key={option.value}
                className="w-full cursor-pointer rounded-t border-b border-stroke hover:bg-primary/5 dark:border-form-strokedark"
                onClick={() => handleOptionToggle(option.value)}
              >
                <div
                  className={`relative flex w-full items-center border-l-2 border-transparent p-2 pl-2 ${
                    selectedOptions.includes(option.value) ? "border-primary" : ""
                  }`}
                >
                  <div className="flex w-full items-center">
                    <div className=" leading-6">{option.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiSelect;
