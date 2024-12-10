import React, { useState, useEffect } from "react";
import { useSearch } from "@/src/context/SearchContext"; // импортируем хук для доступа к контексту
import SearchResults from "./SearchResultsTable";

const Search = () => {
  const { setSearchQuery } = useSearch(); // получаем setSearchQuery из контекста
  const [inputValue, setInputValue] = useState(""); // локальный стейт для управления значением в input
  const [results, setResults] = useState<any[]>([]); // стейт для хранения результатов поиска
  const [isLoading, setIsLoading] = useState(false); // стейт для загрузки данных
  const [debouncedValue, setDebouncedValue] = useState(""); // стейт для дебаунса

  // Обработка изменения текста в поле поиска
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  // Дебаунс: отложенное обновление состояния поиска
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(inputValue); // Обновляем значение для дебаунса
    }, 500); // задержка 500 мс

    // Очистка таймера при изменении inputValue
    return () => {
      clearTimeout(timer);
    };
  }, [inputValue]);

  // Эффект для поиска результатов после того, как прошло время дебаунса
  useEffect(() => {
    if (debouncedValue) {
      setIsLoading(true);
      // Выполняем запрос на сервер
      fetch(`/api/search?query=${debouncedValue}`)
        .then((response) => response.json())
        .then((data) => {
          setResults(data.candidates.concat(data.partners)); // Объединяем результаты (кандидаты + партнёры)
        })
        .catch((error) => {
          console.error("Error fetching search results:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setResults([]); // Если строка поиска пустая, очистить результаты
    }
  }, [debouncedValue]);

  return (
    <div className="relative w-full">
      {/* Поле ввода с иконкой поиска */}
      <div className="relative w-full">
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder={isLoading ? "Загрузка..." : "Search by phone number..."} // изменяем placeholder
          className="w-full bg-transparent pl-9 pr-4 font-medium focus:outline-none xl:w-125"
        />
      </div>

      {/* Контейнер для списка результатов */}
      {results.length > 0 && (
        <div
          className="absolute w-max max-h-60 overflow-y-auto bg-white border border-gray-200 shadow-lg z-10"
          style={{ top: "100%", left: 0 }} // Позиционирование выпадающего списка
        >
          <SearchResults results={results} />
        </div>
      )}
    </div>
  );
};

export default Search;
