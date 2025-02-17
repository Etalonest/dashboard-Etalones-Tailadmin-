import React, { useState, useEffect } from "react";
import SearchResults from "./SearchResultsTable";

// Тип для результата поиска
interface SearchResult {
  id: string;
  name: string;
  phone: string;
  type: "candidate" | "partner";
  private?: boolean;
}

const Search = () => {
  const [inputValue, setInputValue] = useState<string>(""); // локальный стейт для управления значением в input
  const [results, setResults] = useState<SearchResult[]>([]); // стейт для хранения результатов поиска
  const [isLoading, setIsLoading] = useState<boolean>(false); // стейт для загрузки данных
  const [debouncedValue, setDebouncedValue] = useState<string>(""); // стейт для дебаунса

  // Обработка изменения текста в поле поиска
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  // Дебаунс: отложенное обновление состояния поиска
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(inputValue); // Обновляем значение для дебаунса
    }, 500); // задержка 500 мс

    return () => {
      clearTimeout(timer);
    };
  }, [inputValue]);

  // Основной useEffect для обработки запроса к API
  useEffect(() => {
    if (debouncedValue.trim() === "") {
      setResults([]); // Если строка поиска пуста, очищаем результаты
      return;
    }

    setIsLoading(true);

    fetch(`/api/search?query=${debouncedValue}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Полученные данные:", data); // Логируем данные для отладки

        // Проверяем, существует ли поле candidates и является ли оно массивом
        const candidates = Array.isArray(data.results) ? data.results.filter((result: any) => result.type === "candidate") : [];
        const partners = Array.isArray(data.results) ? data.results.filter((result: any) => result.type === "partner") : [];

        console.log("Кандидаты:", candidates); // Логируем кандидатов
        console.log("Партнеры:", partners);   // Логируем партнеров

        // Выводим оба массива в стейт
        setResults([...candidates, ...partners]); // Объединяем их по порядку
      })
      .catch((error) => {
        console.error("Ошибка при получении результатов поиска:", error);
        setResults([]); // Очистить результаты в случае ошибки
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [debouncedValue]); // Запускаем эффект, когда изменяется debouncedValue

  // Логирование результатов поиска
  useEffect(() => {
    console.log("Результаты поиска:", results);
  }, [results]);

  return (
    <div className="relative w-full">
      <div className="relative w-full">
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder={isLoading ? "Загрузка..." : "Поиск по имени или телефону..."}
          className="w-full bg-transparent pl-9 pr-4 font-medium focus:outline-none xl:w-125"
        />
      </div>

      {results.length > 0 && (
        <div
          className="absolute w-max max-h-60 overflow-y-auto bg-white border border-gray-200 shadow-lg z-10"
          style={{ top: "100%", left: 0 }}
        >
          <SearchResults results={results} />
        </div>
      )}
    </div>
  );
};

export default Search;
