import React from "react";

// Тип для результата поиска
interface SearchResult {
  id: string;  // Добавим уникальный идентификатор для каждого результата
  name: string;
  phone: string;
  type: "candidate" | "partner"; // поле type

}

interface SearchResultsProps {
  results: SearchResult[]; // Передаем массив результатов поиска
}

const SearchResultsTable: React.FC<SearchResultsProps> = ({ results }) => {
  console.log("Результаты поиска в SearchResultsTable:", results); // Лог, чтобы проверить, что приходит в компонент

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      {results.length === 0 ? (
        <p className="text-center p-4 text-sm text-gray-500">Результаты не найдены</p> // Если результатов нет, показываем это
      ) : (
        results.map((result) => (
          <div
            className="grid grid-cols-6 gap-4 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
            key={result.id} // Используем уникальный id для ключа
          >
            <div className="col-span-3 flex items-center">
              <p className="text-sm text-black dark:text-white truncate">{result.name}</p>
            </div>
            <div className="col-span-2 flex items-center">
              <p className="text-sm text-black dark:text-white truncate">{result.phone}</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="text-sm text-black dark:text-white truncate">
                {result.type === "candidate" ? "Кандидат" : "Партнёр"} {/* Проверка поля type */}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SearchResultsTable;
